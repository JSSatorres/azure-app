"use server"

import { revalidatePath } from "next/cache"
import { Task } from "./taskRepository"
import { cosmosContainer } from "./cosmosDB"

export async function getTasks(): Promise<Task[]> {
  try {
    const query = "SELECT * FROM c"
    const { resources } = await cosmosContainer.items
      .query<Task>(query)
      .fetchAll()
    console.log(resources)
    console.log(query)

    return resources
  } catch (error) {
    console.error("Error fetching tasks from Cosmos DB:", error)
    return []
  }
}

export async function deleteTaskAction(taskId: string): Promise<boolean> {
  try {
    await cosmosContainer.item(taskId.toString()).delete()
    revalidatePath("/")
    return true
  } catch (error) {
    console.error("Error deleting task from Cosmos DB:", error)
    return false
  }
}

export async function updateTaskCompletionAction(
  taskId: string,
  completed: boolean
): Promise<Task | null> {
  try {
    const { resource: updatedItem } = await cosmosContainer
      .item(taskId.toString())
      .patch({
        operations: [
          {
            op: "replace",
            path: "/completed",
            value: completed,
          },
          {
            op: "replace",
            path: "/updatedAt",
            value: new Date().toISOString(),
          },
        ],
      })
    revalidatePath("/")
    return updatedItem as Task
  } catch (error) {
    console.error("Error updating task completion in Cosmos DB:", error)
    return null
  }
}

export async function createTaskAction(
  title: string,
  description?: string
): Promise<Task | null> {
  try {
    const now = new Date().toISOString()
    const newItem: Omit<Task, "id"> = {
      title,
      description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    const { resource } = await cosmosContainer.items.create(newItem)
    revalidatePath("/")
    return resource as Task
  } catch (error) {
    console.error("Error creating task in Cosmos DB:", error)
    return null
  }
}

export async function updateTaskAction(
  taskId: string,
  title: string,
  description?: string
): Promise<Task | null> {
  try {
    const { resource: updatedItem } = await cosmosContainer
      .item(taskId.toString())
      .replace({
        id: taskId.toString(),
        title,
        description,
        // Assuming you want to preserve the existing completed status and createdAt
        ...(
          await cosmosContainer.item(taskId.toString()).read()
        ).resource,
        updatedAt: new Date().toISOString(),
      })
    revalidatePath("/")
    return updatedItem as Task
  } catch (error) {
    console.error("Error updating task in Cosmos DB:", error)
    return null
  }
}
