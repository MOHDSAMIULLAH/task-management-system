import { TaskStatus } from '@prisma/client';
import prisma from '../config/database';
import { PaginationParams, PaginatedResponse } from '../types';

export class TaskService {
  async getTasks(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const { page, limit, status, search } = params;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (status && status !== 'ALL') {
      where.status = status as TaskStatus;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw { statusCode: 404, message: 'Task not found' };
    }

    return task;
  }

  async createTask(userId: string, data: any) {
    return await prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateTask(taskId: string, userId: string, data: any) {
    const task = await this.getTaskById(taskId, userId);

    return await prisma.task.update({
      where: { id: task.id },
      data,
    });
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId, userId);

    await prisma.task.delete({ where: { id: task.id } });
  }

  async toggleTaskStatus(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId, userId);

    const newStatus =
      task.status === 'COMPLETED'
        ? 'PENDING'
        : task.status === 'PENDING'
        ? 'IN_PROGRESS'
        : 'COMPLETED';

    return await prisma.task.update({
      where: { id: task.id },
      data: { status: newStatus },
    });
  }
}
