import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import { TokenPair } from '../types';

export class AuthService {
  async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      throw { statusCode: 400, message: 'Email already registered' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(email: string, password: string): Promise<TokenPair & { user: any }> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw { statusCode: 401, message: 'Invalid or expired refresh token' };
    }

    const accessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
    });

    const newRefreshToken = generateRefreshToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
    });

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
}
