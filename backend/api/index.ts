// backend/api/index.ts

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth.routes';
import taskRoutes from '../src/routes/task.routes';
import { errorHandler } from '../src/middlewares/errorHandler.middleware';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://task-management-system-gv4m.vercel.app',
  'https://task-management-system-gv4m-h7q0mluzq-mohdsamiullahs-projects.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;
