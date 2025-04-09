'use client';

import { useState, useEffect } from 'react';
import { Task } from '../lib/taskRepository';
import { createTaskAction, updateTaskAction } from '../lib/taskActions';


interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  onTaskAdded: (newTask: Task) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onTaskAdded, onTaskUpdated }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      const updatedTask = await updateTaskAction(task.id, title, description);
      if (updatedTask) {
        onTaskUpdated(updatedTask);
        onClose();
      }
    } else {
      const newTask = await createTaskAction(title, description);
      if (newTask) {
        onTaskAdded(newTask);
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Description:
        </label>
        <textarea
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {task ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;