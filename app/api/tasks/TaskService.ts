import { connectDB } from '@/utils/db';

export class TaskService {

    static async getAllTasks(id_user_task: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT t.*, u.name_user as user_name 
                FROM tasks t
                JOIN users u ON t.id_user_task = u.id_user
                WHERE t.id_user_task = ?
                ORDER BY t.date_created_task DESC
                `,
                [id_user_task]
            );
        return rows;
        } finally {
            connection.release();
        }
    }

    static async getTaskById(id_task: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT t.*, u.name_user as user_name
                FROM tasks t
                JOIN users u ON t.id_user_task = u.id_user
                WHERE t.id_task = ?`,
                [id_task]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async createTask(id_user_task: number, title_task: string, description_task: string, priority_task: string, status_task: string, date_start_task: string, date_completed_task: string) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'INSERT INTO tasks (id_user_task, title_task, description_task, priority_task, status_task, date_start_task, date_completed_task) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id_user_task, title_task, description_task, priority_task, status_task, date_start_task, date_completed_task]
            );
            return rows.insertId;
        } finally {
            connection.release();
        }
    }

    static async updateTask(id_user: number, rol_user: string, id_task: number, title_task: string, description_task: string, priority_task: string) {
        const connection = await connectDB();
        try {
            if (rol_user === 'admin') {
                const [rows]: any = await connection.query(
                    'UPDATE tasks SET title_task = ?, description_task = ?, priority_task = ? WHERE id_task = ?',
                    [title_task, description_task, priority_task, id_task]
                );
                return rows.affectedRows;
            } else {
                const [rows]: any = await connection.query(
                    'UPDATE tasks SET title_task = ?, description_task = ?, priority_task = ? WHERE id_task = ? AND id_user_task = ?',
                    [title_task, description_task, priority_task, id_task, id_user]
                );
                return rows.affectedRows;
            }
            
        } finally {
            connection.release();
        }
    }

    static async updateTaskStatus(id_user: number, rol_user: string, id_task: number, status_task: string, date_start_task: string | null, date_completed_task: string | null) {
        const connection = await connectDB(); 
        try {

            const startDate = date_start_task || null;
            const completedDate = date_completed_task || null;

            if (rol_user === 'admin') {
                const [rows]: any = await connection.query(
                    'UPDATE tasks SET status_task = ?, date_start_task = ?, date_completed_task = ? WHERE id_task = ?',
                    [status_task, startDate, completedDate, id_task]
                );
                return rows.affectedRows;
            } else {
                const [rows]: any = await connection.query(
                    'UPDATE tasks SET status_task = ?, date_start_task = ?, date_completed_task = ? WHERE id_task = ? AND id_user_task = ?',
                    [status_task, startDate, completedDate, id_task, id_user]
                );
                return rows.affectedRows;
            }
            
        } finally {
            connection.release();
        }
    }

    static async deleteTask(id_task: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'DELETE FROM tasks WHERE id_task = ?',
                [id_task]
            );
            return rows.affectedRows;
        } finally {
            connection.release();
        }
    }

}
