"use client"

import { useState } from "react"
import { Task } from "../lib/taskRepository"
import TaskItem from "./TaskItem"
import TaskFormModal from "./TaskFormModal"

interface TaskListClientProps {
  initialTasks: Task[]
}

const TaskListClient: React.FC<TaskListClientProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  const handleAddTaskClick = () => {
    setShowForm(true)
    setEditingTask(null)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
    handleFormClose()
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddTaskClick}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add New Task
      </button>

      {showForm && (
        <TaskFormModal
          task={editingTask}
          onClose={handleFormClose}
          onTaskAdded={handleTaskAdded}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleTaskDeleted}
            onTaskUpdated={handleTaskUpdated}
          />
        ))}
      </ul>
    </div>
  )
}

export default TaskListClient
