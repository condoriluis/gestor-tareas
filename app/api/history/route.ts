import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { TaskHistoryService } from '../tasks/TaskHistoryService';

/**
 * @swagger
 * /api/history:
 *   get:
 *     tags: [Historial]
 *     summary: Obtener historial de tareas del usuario autenticado
 *     description: Endpoint para obtener el historial completo de acciones realizadas en tareas por el usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de acciones del historial
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_history:
 *                     type: integer
 *                   id_task_history:
 *                     type: integer
 *                   id_user_history:
 *                     type: integer
 *                   old_status:
 *                     type: string
 *                   new_status:
 *                     type: string
 *                   action_history:
 *                     type: string
 *                   description_history:
 *                     type: string
 *                   date_created_history:
 *                     type: string
 *                   user_name:
 *                     type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener el historial
 */
export async function GET(request: Request) {

  const session = await validateToken();
  
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {

    const tasks = await TaskHistoryService.getAllTaskHistory(session.id_user);
    return NextResponse.json(tasks, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al obtener tareas' }, 
      { status: 500 }
    );
  }
}