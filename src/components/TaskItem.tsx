'use client';

import { Task } from '../lib/taskRepository';
import { deleteTaskAction, updateTaskCompletionAction } from '../lib/taskActions';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onTaskUpdated }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCompleted = e.target.checked;
    setIsCompleted(newCompleted);
    const updatedTask = await updateTaskCompletionAction(task.id, newCompleted);
    if (updatedTask) {
      onTaskUpdated(updatedTask);
    }
  };

  const handleDelete = async () => {
    const success = await deleteTaskAction(task.id);
    if (success) {
      onDelete(task.id);
    }
  };

  return (
    <li key={task.id} className="py-4 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{task.title}</h3>
        {task.description && <p className="text-gray-600">{task.description}</p>}
        <p className="text-sm text-gray-500">
          Created At: {new Date(task.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Updated At: {new Date(task.updatedAt).toLocaleString()}
        </p>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-gray-700 text-sm">Completed</label>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;