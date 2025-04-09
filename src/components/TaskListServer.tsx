import TaskListClient from "./TaskListClient"
import { getTasks } from "@/lib/taskActions"

const TaskListServer: React.FC = async () => {
  const tasks = await getTasks()

  return <TaskListClient initialTasks={tasks} />
}

export default TaskListServer
