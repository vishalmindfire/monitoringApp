import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import jobRoutes from '#routes/jobRoutes.js';

import { corsMiddleware } from '#configs/cors.js';

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
const httpPort = 4000;

app.use(morgan('combined'));

app.use('/api', jobRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ message });
});

const server = http.createServer(app);
server.listen(httpPort);
