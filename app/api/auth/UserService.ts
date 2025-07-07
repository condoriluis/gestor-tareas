import { connectDB } from '@/utils/db';
import bcrypt from 'bcryptjs';

export class UserService {

  static async getUserById(idUser: number) {
    const connection = await connectDB();
    try {
      const [rows]: any = await connection.query(
        'SELECT * FROM users WHERE id_user = ?', 
        [idUser]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async getUserByEmail(email: string) {
    const connection = await connectDB();
    try {
      const [rows]: any = await connection.query(
        'SELECT * FROM users WHERE email_user = ?', 
        [email]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async getUserByRol(rol: string) {
    const connection = await connectDB();
    try {
      const [rows]: any = await connection.query(
        'SELECT * FROM users WHERE rol_user = ?',
        [rol]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getAllUsers() {
    const connection = await connectDB();
    try {
      const [rows]: any = await connection.query(
        'SELECT id_user, name_user, email_user, status_user, rol_user, date_created_user FROM users ORDER BY date_created_user DESC'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async createUser(email: string, password: string, name: string, status: number, rol: string) {
    const connection = await connectDB();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await connection.query(
        'INSERT INTO users (email_user, password_user, name_user, status_user, rol_user) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, name, status, rol]
      );
    } finally {
      connection.release();
    }
  }

  static async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async forgotPassword(email: string, newPassword: string) {
    const connection = await connectDB();
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await connection.query(
        'UPDATE users SET password_user = ? WHERE email_user = ?',
        [hashedPassword, email]
      );
    } finally {
      connection.release();
    }
  }

  static async updatePassword(idUser: number, newPassword: string) {
    const connection = await connectDB();
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await connection.query(
        'UPDATE users SET password_user = ? WHERE id_user = ?',
        [hashedPassword, idUser]
      );
    } finally {
      connection.release();
    }
  }

  static async updateUserStatus(idUser: number, status: number) {
    const connection = await connectDB();
    try {
      await connection.query(
        'UPDATE users SET status_user = ? WHERE id_user = ?',
        [status, idUser]
      );
    } finally {
      connection.release();
    }
  }

  static async updateUserData(idUser: number, data: {name?: string, email?: string, rol?: string}) {
    const connection = await connectDB();
    try {
      const updates = [];
      const values = [];
      
      if (data.name) {
        updates.push('name_user = ?');
        values.push(data.name);
      }
      
      if (data.email) {
        updates.push('email_user = ?');
        values.push(data.email);
      }
      
      if (data.rol) {
        updates.push('rol_user = ?');
        values.push(data.rol);
      }
      
      if (updates.length > 0) {
        values.push(idUser);
        await connection.query(
          `UPDATE users SET ${updates.join(', ')} WHERE id_user = ?`,
          values
        );
      }
    } finally {
      connection.release();
    }
  }

  static async deleteUser(idUser: number) {
    const connection = await connectDB();
    try {
      // Primero eliminamos las tareas asociadas
      await connection.query(
        'DELETE FROM tasks WHERE id_user_task = ?',
        [idUser]
      );
      
      // Luego eliminamos el usuario
      await connection.query(
        'DELETE FROM users WHERE id_user = ?',
        [idUser]
      );
    } finally {
      connection.release();
    }
  }
}
