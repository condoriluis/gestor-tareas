import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { TaskService } from './TaskService';
import { UserService } from '../auth/UserService';
import { toBoliviaDateTime } from '@/utils/dateService';
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