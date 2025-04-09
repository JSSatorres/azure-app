'use client';

import { Task } from '../lib/taskRepository';
import TaskForm from './TaskForm';

interface TaskFormModalProps {
  task: Task | null;
  onClose: () => void;
  onTaskAdded: (newTask: Task) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ task, onClose, onTaskAdded, onTaskUpdated }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10 modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-lg font-bold mb-2">{task ? 'Edit Task' : 'Add New Task'}</h2>
        <TaskForm task={task} onClose={onClose} onTaskAdded={onTaskAdded} onTaskUpdated={onTaskUpdated} />
      </div>
    </div>
  );
};

export default TaskFormModal;