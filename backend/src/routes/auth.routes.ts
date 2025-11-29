import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { validateRequest } from '../middlewares/errorHandler.middleware';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  registerValidator,
  validateRequest,
  authController.register
);

router.post(
  '/login',
  loginValidator,
  validateRequest,
  authController.login
);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

export default router;
