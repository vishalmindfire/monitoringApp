import client from 'prom-client';

export const register = new client.Registry();

client.collectDefaultMetrics({
  register,
});

export const totalJobsSubmitted = new client.Gauge({
  name: 'total_jobs_submitted',
  help: 'Total jobs submitted',
});

export const totalJobsCompleted = new client.Gauge({
  name: 'total_jobs_completed',
  help: 'Total jobs completed',
});

export const queueLength = new client.Gauge({
  name: 'queue_length',
  help: 'Current queue length',
});

export const averageProcessingTime = new client.Gauge({
  name: 'average_processing_time_ms',
  help: 'Average job processing time in ms',
});

register.registerMetric(totalJobsSubmitted);
register.registerMetric(totalJobsCompleted);
register.registerMetric(queueLength);
register.registerMetric(averageProcessingTime);
