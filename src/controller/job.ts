import type { Request, Response } from 'express';
import { Queue } from 'bullmq';
import RedisClient from '#configs/redis.js';

export const scheduleJob = async (req: Request, res: Response) => {
  const jobQueue = new Queue('job-queue', { connection: RedisClient.getClient() });
  const job = await jobQueue.add(
    'send-job',
    {},
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    }
  );

  await RedisClient.getClient().incr('jobs:submitted');
  res.status(201).json({
    message: 'Job queued',
    jobId: job.id,
  });
};

export const getStatus = async (req: Request, res: Response) => {
  const jobId = Number(req.params.id);
  const jobQueue = new Queue('job-queue', { connection: RedisClient.getClient() });
  const job = await jobQueue.getJob(jobId.toString());
  const status = await job?.getState();

  res.status(200).json({
    message: 'Job Status',
    status: status,
  });
};
