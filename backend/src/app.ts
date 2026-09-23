import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { ApiResponse } from './utils/apiResponse.js';

const app: Express = express();

// Security & Logger Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse(
      200,
      { status: 'healthy', timestamp: new Date().toISOString(), env: env.NODE_ENV },
      'On-Demand Service API Server is healthy'
    )
  );
});

// API Routes
app.use('/api/v1', routes);

// Global 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json(new ApiResponse(404, null, 'Route not found'));
});

// Global Error Middleware
app.use(errorMiddleware);

export default app;
