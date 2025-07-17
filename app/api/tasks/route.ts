import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { TaskService } from './TaskService';
import { UserService } from '../auth/UserService';
import { nowBolivia, toBoliviaDateTime } from '@/utils/dateService';
import { TaskHistoryService } from './TaskHistoryService';

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

export async function PATCH(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    
    const user = await UserService.getUserById(session.id_user);

    const body = await request.json();
    const { taskId, newStatus } = body;

    const task = await TaskService.getTaskById(parseInt(taskId));

    if (!task) {
      return NextResponse.json({ message: `Tarea con ID:${taskId} no fue encontrada` }, { status: 404 });
    }

    let prioridad = '';
    let action_history = '';
    let description_history = '';
    
    if (task.priority_task === 'low') {
      prioridad = 'Baja';
    }
    if (task.priority_task === 'medium') {
      prioridad = 'Media';
    }
    if (task.priority_task === 'high') {
      prioridad = 'Alta';
    }

    action_history = 'Estado cambiado';
    description_history = `Tarea: ${task.title_task} con prioridad: ${prioridad}`;

    let dateStart = null;
    let dateCompleted = null;

    if (newStatus === 'todo') {
      dateStart = null;
      dateCompleted = null;
    }

    if (newStatus === 'in_progress') {
      dateStart = nowBolivia();
      dateCompleted = null;
    }

    if (newStatus === 'done') {
      dateStart = task.date_start_task 
        ? (typeof task.date_start_task === 'string' && task.date_start_task.includes('T') 
            ? toBoliviaDateTime(task.date_start_task)
            : task.date_start_task)
        : nowBolivia();
      
      dateCompleted = nowBolivia();
    }

    const updateStatusTask = await TaskService.updateTaskStatus(session.id_user, user.rol_user, taskId, newStatus, dateStart, dateCompleted);
    
    if (updateStatusTask) {
      await TaskHistoryService.createTaskHistory(taskId, session.id_user, task.status_task, newStatus, action_history, description_history);
    }
        
    const getUpdatedStatusTask = await TaskService.getTaskById(taskId);
    return NextResponse.json(getUpdatedStatusTask, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar el estado de la tarea' },
      { status: 500 }
    );
  }
}