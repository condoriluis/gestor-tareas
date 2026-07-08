import { db } from '@/lib/db';

export class TaskService {

  static async getAllTasks(userId: number) {
    const tasks = await db.task.findMany({
      where: { userId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map(t => ({ ...t, user_name: t.user.name }));
  }

  static async getTaskById(id: number) {
    const task = await db.task.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (!task) return null;
    return { ...task, user_name: task.user.name };
  }

  static async createTask(userId: number, title: string, description: string, priority: string, status: string, startDate: string | null, completedDate: string | null) {
    const task = await db.task.create({
      data: {
        userId,
        title,
        description,
        priority,
        status,
        startDate: startDate ? new Date(startDate) : null,
        completedDate: completedDate ? new Date(completedDate) : null,
      },
    });
    return task.id;
  }

  static async updateTask(idUser: number, rolUser: string, idTask: number, title: string, description: string, priority: string) {
    const where = rolUser === 'admin'
      ? { id: idTask }
      : { id: idTask, userId: idUser };

    const result = await db.task.updateMany({
      where,
      data: { title, description, priority },
    });
    return result.count;
  }

  static async updateTaskStatus(idUser: number, rolUser: string, idTask: number, status: string, startDate: string | null, completedDate: string | null) {
    const where = rolUser === 'admin'
      ? { id: idTask }
      : { id: idTask, userId: idUser };

    const result = await db.task.updateMany({
      where,
      data: {
        status,
        startDate: startDate ? new Date(startDate) : null,
        completedDate: completedDate ? new Date(completedDate) : null,
      },
    });
    return result.count;
  }

  static async deleteTask(id: number, userId: number, rol: string) {
    const where = rol === 'admin'
      ? { id }
      : { id, userId };

    await db.taskHistory.deleteMany({ where: { taskId: id } });
    const result = await db.task.deleteMany({ where });
    return result.count;
  }
}
