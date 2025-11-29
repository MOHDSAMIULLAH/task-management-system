import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
} from '../validators/task.validator';
import { validateRequest } from '../middlewares/errorHandler.middleware';

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

router.get('/', taskController.getTasks);

router.post(
  '/',
  createTaskValidator,
  validateRequest,
  taskController.createTask
);

router.get(
  '/:id',
  taskIdValidator,
  validateRequest,
  taskController.getTaskById
);

router.patch(
  '/:id',
  updateTaskValidator,
  validateRequest,
  taskController.updateTask
);

router.delete(
  '/:id',
  taskIdValidator,
  validateRequest,
  taskController.deleteTask
);

router.post(
  '/:id/toggle',
  taskIdValidator,
  validateRequest,
  taskController.toggleTaskStatus
);

export default router;
