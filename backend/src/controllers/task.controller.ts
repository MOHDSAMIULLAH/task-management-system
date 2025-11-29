import { Response } from 'express';
import { AuthRequest } from '../types';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export class TaskController {
  async getTasks(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const result = await taskService.getTasks(req.userId!, {
        page,
        limit,
        status,
        search,
      });

      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getTaskById(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.getTaskById(req.params.id, req.userId!);
      res.json(task);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async createTask(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.createTask(req.userId!, req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.updateTask(
        req.params.id,
        req.userId!,
        req.body
      );
      res.json(task);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      await taskService.deleteTask(req.params.id, req.userId!);
      res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async toggleTaskStatus(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.toggleTaskStatus(req.params.id, req.userId!);
      res.json(task);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
