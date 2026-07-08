import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export class UserService {

  static async getUserById(id: number) {
    return db.user.findUnique({ where: { id } });
  }

  static async getUserByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  static async getUserByRol(rol: string) {
    return db.user.findMany({ where: { rol } });
  }

  static async getAllUsers() {
    return db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        rol: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createUser(email: string, password: string, name: string, status: number, rol: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.user.create({
      data: { email, password: hashedPassword, name, status, rol },
    });
  }

  static async verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async forgotPassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  static async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  static async updateUserStatus(id: number, status: number) {
    return db.user.update({
      where: { id },
      data: { status },
    });
  }

  static async updateUserData(id: number, data: { name?: string; email?: string; rol?: string }) {
    return db.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: number) {
    await db.task.deleteMany({ where: { userId: id } });
    await db.taskHistory.deleteMany({ where: { userId: id } });
    return db.user.delete({ where: { id } });
  }
}
