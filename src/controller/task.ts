import RedisClient from '#configs/redis.js';
import bcrypt from 'bcryptjs';
export const generatePrime = async (jobId: string, limit = 100000) => {
  const isPrime = new Array(limit + 1).fill(true);

  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes = [];

  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  await RedisClient.getClient().set(jobId, JSON.stringify(primes));
};

export const sortLargeArray = (size = 100000): number[] => {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 1_000_000));

  return arr.sort((a, b) => a - b);
};

export const encryptData = async (value: string) => {
  return bcrypt.hash(value, 10);
};
