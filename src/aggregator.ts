import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { corsMiddleware } from '#configs/cors.js';
import { totalJobsSubmitted, totalJobsCompleted, queueLength, averageProcessingTime, register } from '#configs/aggregator-metrices.js';
import { getStats } from '#controller/stats.js';

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
const httpPort = 7000;

app.use(morgan('combined'));

app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/stats', async (_req: Request, res: Response) => {
  const stats = await getStats();
  res.json(stats);
});

app.get('/metrics', async (_req: Request, res: Response) => {
  const stats = await getStats();
  totalJobsSubmitted.set(stats.totalJobsSubmitted);
  totalJobsCompleted.set(stats.totalJobsCompleted);
  queueLength.set(stats.queueLength);
  averageProcessingTime.set(stats.averageProcessingTimeMs);

  res.set('Content-Type', register.contentType);

  res.end(await register.metrics());
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ message });
});

const server = http.createServer(app);
server.listen(httpPort);
