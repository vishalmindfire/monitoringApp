import { Redis } from 'ioredis';

export class RedisClient {
  private static instance: RedisClient | null;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
    });
  }

  public static getInstance(): RedisClient {
    RedisClient.instance ??= new RedisClient();
    return RedisClient.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  public async close(): Promise<void> {
    await this.client.quit();
    RedisClient.instance = null;
  }
}

export default RedisClient.getInstance();
