import { db } from '@/lib/db';

export class TaskHistoryService {

  static async getAllTaskHistory(userId: number) {
    const history = await db.taskHistory.findMany({
      where: { userId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return history.map(h => ({ ...h, user_name: h.user.name }));
  }

  static async getTaskHistoryById(id: number) {
    const history = await db.taskHistory.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (!history) return null;
    return { ...history, user_name: history.user.name };
  }

  static async createTaskHistory(taskId: number, userId: number, oldStatus: string, newStatus: string, action: string, description: string) {
    return db.taskHistory.create({
      data: {
        taskId,
        userId,
        oldStatus,
        newStatus,
        action,
        description,
      },
    });
  }

  static async deleteAllTaskHistory(userId: number) {
    return db.taskHistory.deleteMany({ where: { userId } });
  }

  static async deleteSingleTaskHistory(id: number) {
    return db.taskHistory.deleteMany({ where: { id } });
  }
}
