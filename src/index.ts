import type { Request, Response } from 'express';

import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { corsMiddleware } from '#configs/cors.js';

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
const httpPort = 4000;

app.use(morgan('combined'));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'App running',
  });
});

const server = http.createServer(app);
server.listen(httpPort);
