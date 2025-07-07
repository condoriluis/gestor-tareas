import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskService } from '../TaskService';
import { TaskHistoryService } from '../TaskHistoryService';

export async function POST(request: Request) {
  const { 
    title_task, description_task, priority_task, status_task, date_start_task, date_completed_task,
    old_status, new_status, action_history, description_history } = await request.json();

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }
  
  try {
    
    const newTaskId = await TaskService.createTask(session.id_user, title_task, description_task, priority_task, status_task, date_start_task, date_completed_task);
    const newTask = await TaskService.getTaskById(newTaskId);
    
    if (!newTask) {
      throw new Error('Error: No se encontró la tarea recién creada');
    }
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
