
import { v4 as uuid } from "uuid"; 
import { cosmosContainer } from "./cosmosDB";

export interface Task {
  id: string; 
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string; 
  updatedAt: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const query = "SELECT * FROM c";
  const { resources } = await cosmosContainer.items.query<Task>(query).fetchAll();
  return resources;
};


export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    const { resource } = await cosmosContainer.item(id, id).read<Task>();
    return resource ?? null;
  } catch {
    return null;
  }
};


export const createTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
  const now = new Date().toISOString();
  const task: Task = {
    id: uuid(),
    title: data.title,
    description: data.description ?? null,
    completed: data.completed,
    createdAt: now,
    updatedAt: now,
  };

  const { resource } = await cosmosContainer.items.create<Task>(task);
  return resource!;
};


export const updateTask = async (
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
): Promise<Task | null> => {
  const existing = await getTaskById(id);
  if (!existing) return null;

  const updated: Task = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await cosmosContainer.items.upsert<Task>(updated);
  return resource!;
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    await cosmosContainer.item(id, id).delete();
    return true;
  } catch {
    return false;
  }
};
