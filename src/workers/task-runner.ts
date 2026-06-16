import { parentPort, workerData } from 'worker_threads';

import { generatePrime, sortLargeArray, encryptData } from '#controller/task.js';

async function execute(jobId: string): Promise<unknown> {
  const primes = generatePrime(jobId);

  const sortedArray = sortLargeArray();

  const hashValue = await encryptData('testData');

  return {
    primes: primes,
    sortedArray: sortedArray,
    hashValue: hashValue,
  };
}

void (async () => {
  try {
    const result = await execute(workerData as string);

    parentPort?.postMessage({
      success: true,
      result,
    });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
})();
