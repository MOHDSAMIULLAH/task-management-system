import { Response } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const { email, password, name } = req.body;
      const user = await authService.register(email, password, name);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async refresh(req: AuthRequest, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
      }

      const tokens = await authService.refresh(refreshToken);
      res.json(tokens);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async logout(req: AuthRequest, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
      }

      await authService.logout(refreshToken);
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
