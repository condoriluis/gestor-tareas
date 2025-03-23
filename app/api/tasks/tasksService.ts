import { query } from '@/utils/db';
import { Task } from '@/utils/types'

export const createTask = async (title: string, description: string, priority: string, status: string): Promise<number> => {
  const result = await query<{ insertId: number }>(
    'INSERT INTO tasks (title, description, priority, status, position) VALUES (?, ?, ?, ?, ?)',
    [title, description, priority, status, 1]
  );


  if (result && 'insertId' in result) {
    return result.insertId as number;
  }

  throw new Error('Error al crear la tarea: No se pudo obtener el ID de inserción');
};

export const getAllTasks = async (): Promise<Task[]> => {
  const result = await query<Task[]>('SELECT * FROM tasks ORDER BY created_at DESC');
  return Array.isArray(result) ? result.flat() : [];
};

export const getTaskById = async (id: number): Promise<Task[] | null> => {
  const result = await query<Task[]>('SELECT * FROM tasks WHERE id = ?', [id]);

  return result.length > 0 ? result[0] : null;
};

export const updateTask = async (id: number, title: string, description: string, priority: string): Promise<number> => {
  const result = await query<{ affectedRows: number }>(
    'UPDATE tasks SET title = ?, description = ?, priority = ? WHERE id = ?', 
    [title, description, priority, id]
  );

  return result.length;
};

export const updateTaskStatus = async (id: number, status: string): Promise<number> => {

  const result = await query<{ affectedRows: number }>(
    'UPDATE tasks SET status = ? WHERE id = ?', 
    [status, id]
  );

  return result.length;
};

export const deleteTask = async (id: number): Promise<number> => {
  const results = await query<{ affectedRows: number }>('DELETE FROM tasks WHERE id = ?', [id]);

  return results.length;
};