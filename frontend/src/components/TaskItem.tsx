'use client';

import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete, onToggle }: TaskItemProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
              {statusLabels[task.status]}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onToggle(task.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Toggle Status"
          >
            🔄
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
