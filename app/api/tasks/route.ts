import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { TaskService } from './TaskService';
import { UserService } from '../auth/UserService';
import { toBoliviaDateTime } from '@/utils/dateService';
import { TaskHistoryService } from './TaskHistoryService';

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tareas]
 *     summary: Obtener todas las tareas del usuario autenticado
 *     description: Retorna la lista completa de tareas del usuario autenticado
 *     operationId: getAllTasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de tareas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_task:
 *                     type: integer
 *                     example: 1
 *                   id_user_task:
 *                     type: integer
 *                     example: 1
 *                   title_task:
 *                     type: string
 *                     example: Reunión con equipo
 *                   description_task:
 *                     type: string
 *                     example: Reunión con equipo para discutir los próximos proyectos
 *                   status_task:
 *                     type: string
 *                     enum: [todo, in_progress, done]
 *                     example: todo
 *                   priority_task:
 *                     type: string
 *                     enum: [low, medium, high]
 *                     example: medium
 *                   date_start_task:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-01-01T09:00:00.000Z
 *                   date_completed_task:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-01-02T17:00:00.000Z
 *                   date_created_task:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-01-01T09:00:00.000Z
 *                   user_name:
 *                     type: string
 *                     example: Nombre usuario
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error del servidor
 */
export async function GET(request: Request) {

  const session = await validateToken();
  
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {

    const tasks = await TaskService.getAllTasks(session.id_user);
    return NextResponse.json(tasks, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al obtener tareas' }, 
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/tasks:
 *   patch:
 *     tags: [Tareas]
 *     summary: Actualizar el estado de una tarea
 *     description: Permite actualizar el estado de una tarea
 *     operationId: updateTaskStatus
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idTask]
 *             properties:
 *               idTask:
 *                 type: integer
 *                 description: ID de la tarea a actualizar
 *                 example: 0
 *               title:
 *                 type: string
 *                 description: Titulo de la tarea
 *                 example: Tarea 1
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Prioridad de la tarea
 *                 example: medium
 *               old_status:
 *                 type: string
 *                 description: Estado anterior para registro histórico
 *                 example: todo
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 description: Nuevo estado de la tarea
 *                 example: in_progress
 *               date_start:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha de inicio
 *                 example: 2025-01-01T10:00:00.000Z
 *               date_completed:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha de completado
 *                 example: null
 *     responses:
 *       '200':
 *         description: Tarea actualizada exitosamente
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error al actualizar el estado de la tarea
 */
export async function PATCH(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    
    const user = await UserService.getUserById(session.id_user);

    const body = await request.json();
    const { idTask, status, title, priority, date_start, date_completed, old_status } = body;

    let prioridad = '';
    let action_history = '';
    let description_history = '';
    
    if (priority === 'low') {
      prioridad = 'Baja';
    }
    if (priority === 'medium') {
      prioridad = 'Media';
    }
    if (priority === 'high') {
      prioridad = 'Alta';
    }

    action_history = 'Estado cambiado';
    description_history = `Tarea: ${title} con prioridad: ${prioridad}`;

    const validatedDateStart = date_start 
      ? (typeof date_start === 'string' && date_start.includes('T')
          ? toBoliviaDateTime(date_start)
          : date_start)
      : null;
      
    const validatedDateCompleted = date_completed
      ? (typeof date_completed === 'string' && date_completed.includes('T')
          ? toBoliviaDateTime(date_completed)
          : date_completed)
      : null;

    const updateStatus = await TaskService.updateTaskStatus(session.id_user, user.rol_user, idTask, status, validatedDateStart, validatedDateCompleted);
    
    if (updateStatus) {
      await TaskHistoryService.createTaskHistory(idTask, session.id_user, old_status, status, action_history, description_history);
    }
        
    const updatedTask = await TaskService.getTaskById(idTask);
    return NextResponse.json(updatedTask, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar el estado de la tarea' },
      { status: 500 }
    );
  }
}