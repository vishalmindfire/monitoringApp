import cors, { type CorsOptions } from 'cors';
import type { RequestHandler } from 'express';

const allowedOrigins = ['http://localhost'];
const corsOptions: CorsOptions = {
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
};

export const corsMiddleware: RequestHandler = cors(corsOptions) as RequestHandler;
