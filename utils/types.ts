export interface Task {
  id: number;
  userId: number;
  user?: { name: string };
  title: string;
  description: string;
  priority: string;
  status?: string;
  startDate?: string | null;
  completedDate?: string | null;
  createdAt?: string;
}

export interface TaskHistory {
  id: number;
  taskId: number;
  userId: number;
  user?: { name: string };
  oldStatus: string;
  newStatus: string;
  action: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  status: number;
  createdAt: string;
}
