import { body, param } from 'express-validator';

export const createTaskValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
];

export const updateTaskValidator = [
  param('id').isUUID().withMessage('Invalid task ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
];

export const taskIdValidator = [
  param('id').isUUID().withMessage('Invalid task ID'),
];
