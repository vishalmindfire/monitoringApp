import type { Request, Response } from 'express';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { corsMiddleware } from '#configs/cors.js';

import { Worker } from 'bullmq';
import RedisClient from '#configs/redis.js';
import { jobsProcessedTotal, jobErrorsTotal, jobProcessingTime } from '#configs/worker-metrices.js';
import { register } from '#configs/worker-metrices.js';
import { runWorkerThread } from '#workers/task-worker.js';
export const jobWorker = new Worker(
  'job-queue',
  async (job) => {
    const startTime = Date.now();
    const endTimer = jobProcessingTime.startTimer();
    if (!job.id) {
      jobErrorsTotal.inc();
      endTimer();
    } else {
      try {
        const result = await runWorkerThread(job.id);
        jobsProcessedTotal.inc();
        const processingTime = Date.now() - startTime;
        await Promise.all([
          RedisClient.getClient().incr('jobs:completed'),
          RedisClient.getClient().incrbyfloat('jobs:processing_time_total', processingTime),
        ]);
        return result;
      } catch (error) {
        jobErrorsTotal.inc();
        await RedisClient.getClient().incr('jobs:failed');
        throw error;
      } finally {
        endTimer();
      }
    }
  },
  {
    connection: RedisClient.getClient(),
    concurrency: 10,
  }
);

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
const httpPort = 5000;

app.use(morgan('combined'));

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);

  res.end(await register.metrics());
});

app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.use((err: unknown, _req: Request, res: Response) => {
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ message });
});

const server = http.createServer(app);
server.listen(httpPort);

function shutdown() {
  void (async () => {
    await jobWorker.close();

    server.close(() => {
      process.exit(0);
    });
  })();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
