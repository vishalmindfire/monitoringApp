import { Queue } from 'bullmq';
import RedisClient from '#configs/redis.js';

const queue = new Queue('job-queue', {
  connection: RedisClient.getClient(),
});

export async function getStats() {
  const waiting = await queue.getJobCounts('waiting', 'active', 'completed', 'failed');

  const totalSubmitted = Number((await RedisClient.getClient().get('jobs:submitted')) ?? 0);

  const totalCompleted = Number((await RedisClient.getClient().get('jobs:completed')) ?? 0);

  const totalProcessingTime = Number((await RedisClient.getClient().get('jobs:processing_time_total')) ?? 0);

  const avgProcessingTime = totalCompleted > 0 ? totalProcessingTime / totalCompleted : 0;

  return {
    totalJobsSubmitted: totalSubmitted,
    totalJobsCompleted: totalCompleted,
    queueLength: waiting.waiting,
    averageProcessingTimeMs: avgProcessingTime,
  };
}
