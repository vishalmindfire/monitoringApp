import path from 'path';
import { Worker } from 'worker_threads';

export function runWorkerThread(jobId: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'task-runner.js'), {
      workerData: jobId,
    });

    worker.once('message', (message: { success: boolean; result: string | []; error: string }) => {
      if (message.success) {
        resolve(message.result);
      } else {
        reject(new Error(message.error));
      }
    });

    worker.once('error', reject);

    worker.once('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker exited with code ${code.toString()}`));
      }
    });
  });
}
