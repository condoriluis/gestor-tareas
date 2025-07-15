import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskService } from '../TaskService';
import { TaskHistoryService } from '../TaskHistoryService';

/**
 * @swagger
 * /api/tasks/create:
 *   post:
 *     tags: [Tareas]
 *     summary: Crear una nueva tarea
 *     description: Endpoint para crear una nueva tarea en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title_task
 *               - description_task
 *               - priority_task
 *               - status_task
 *             properties:
 *               title_task:
 *                 type: string
 *                 description: Título de la tarea
 *                 example: Reunión de equipo
 *               description_task:
 *                 type: string
 *                 description: Descripción detallada de la tarea
 *                 example: Discutir los objetivos del sprint
 *               priority_task:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Prioridad de la tarea
 *                 example: medium
 *               status_task:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 description: Estado inicial de la tarea
 *                 example: todo
 *               date_start_task:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de inicio programada (opcional)
 *                 example: null
 *               date_completed_task:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de completado estimada (opcional)
 *                 example: null
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_task:
 *                   type: integer
 *                   example: 1
 *                 id_user_task:
 *                   type: integer
 *                   example: 1
 *                 title_task:
 *                   type: string
 *                   example: Tarea de ejemplo
 *                 description_task:
 *                   type: string
 *                   example: Descripción de la tarea de ejemplo
 *                 priority_task:
 *                   type: string
 *                   enum: [low, medium, high]
 *                   example: medium
 *                 status_task:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                   example: todo
 *                 date_start_task:
 *                   type: string
 *                   format: date-time
 *                   example: null
 *                 date_completed_task:
 *                   type: string
 *                   format: date-time
 *                   example: null
 *                 date_created_task:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-01-01T09:00:00.000Z
 *                 user_name:
 *                   type: string
 *                   example: Nombre usuario
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
export async function POST(request: Request) {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const body = await request.json();
  const { title_task, description_task, priority_task, status_task, date_start_task, date_completed_task } = body;

  let prioridad = "";
  let estado = "";
  if (priority_task.trim() === "low") {
    prioridad = "Baja";
  }
  if (priority_task.trim() === "medium") {
    prioridad = "Media";
  }
  if (priority_task.trim() === "high") {
    prioridad = "Alta";
  }

  if (status_task.trim() === "todo") {
    estado = "To-do";
  }
  if (status_task.trim() === "in_progress") {
    estado = "En progreso";
  }
  if (status_task.trim() === "done") {
    estado = "Completado";
  }

  const old_status = '';
  const new_status = '';
  const action_history = 'Tarea creada';
  const description_history = `${title_task} con prioridad: ${prioridad} y estado: ${estado}`;

  try {
    
    const newTaskId = await TaskService.createTask(session.id_user, title_task, description_task, priority_task, status_task, date_start_task, date_completed_task);
    const newTask = await TaskService.getTaskById(newTaskId);
    
    await TaskHistoryService.createTaskHistory(newTaskId, session.id_user, old_status, new_status, action_history, description_history);
    
    return NextResponse.json(
      newTask, { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
