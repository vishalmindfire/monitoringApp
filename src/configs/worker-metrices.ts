import client from 'prom-client';

client.collectDefaultMetrics();

export const jobsProcessedTotal = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Total number of successfully processed jobs',
});

export const jobErrorsTotal = new client.Counter({
  name: 'job_errors_total',
  help: 'Total number of job processing failures',
});

export const jobProcessingTime = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Time spent processing jobs',
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
});

export const register = client.register;
