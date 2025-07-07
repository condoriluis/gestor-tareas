import { connectDB } from '@/utils/db';

export class TaskHistoryService {

    static async getAllTaskHistory(id_user_history: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT t.*, u.name_user as user_name 
                FROM task_history t
                JOIN users u ON t.id_user_history = u.id_user
                WHERE t.id_user_history = ?
                ORDER BY t.date_created_history DESC
                `,
                [id_user_history]
            );
        return rows;
        } finally {
            connection.release();
        }
    }

    static async getTaskHistoryById(id_task_history: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT t.*, u.name_user as user_name
                FROM task_history t
                JOIN users u ON t.id_user_history = u.id_user
                WHERE t.id_task_history = ?`,
                [id_task_history]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async createTaskHistory(id_task_history: number, id_user_history: number, old_status_history: string, new_status_history: string, action_history: string, description_history: string) {
        const connection = await connectDB();
        try {
            await connection.query(
                'INSERT INTO task_history (id_task_history, id_user_history, old_status_history, new_status_history, action_history, description_history) VALUES (?, ?, ?, ?, ?, ?)',
                [id_task_history, id_user_history, old_status_history, new_status_history, action_history, description_history]
            );
        } finally {
            connection.release();
        }
    }

    static async deleteAllTaskHistory(id_user_history: number) {
        const connection = await connectDB();
        try {
            await connection.query(
                'DELETE FROM task_history WHERE id_user_history = ?',
                [id_user_history]
            );
        } finally {
            connection.release();
        }
    }

    static async deleteSingleTaskHistory(id_history: number) {
        const connection = await connectDB();
        try {
            await connection.query(
                'DELETE FROM task_history WHERE id_history = ?',
                [id_history]
            );
        } finally {
            connection.release();
        }
    }

}
