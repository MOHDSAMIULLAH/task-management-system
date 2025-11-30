import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

export const generateAccessToken = (payload: JWTPayload): string => {
  const expiresIn = process.env.JWT_ACCESS_EXPIRY || '15m';
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: expiresIn as any,
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: expiresIn as any,
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload;
};
