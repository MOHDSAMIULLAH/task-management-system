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

// Manual CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'https://task-management-system-gv4m.vercel.app'
  ];
  
  if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;
