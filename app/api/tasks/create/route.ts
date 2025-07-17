import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskService } from '../TaskService';
import { TaskHistoryService } from '../TaskHistoryService';

export async function POST(request: Request) {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const body = await request.json();
  const { title_task, description_task, priority_task } = body;

  let prioridad = "";
  if (priority_task.trim() === "low") {
    prioridad = "Baja";
  }
  if (priority_task.trim() === "medium") {
    prioridad = "Media";
  }
  if (priority_task.trim() === "high") {
    prioridad = "Alta";
  }

  const old_status = '';
  const new_status = '';
  const action_history = 'Tarea creada';
  const description_history = `${title_task} con prioridad: ${prioridad} y estado: To-do`;

  try {
    
    const newTaskId = await TaskService.createTask(session.id_user, title_task, description_task, priority_task, 'todo', null, null);
    const newTask = await TaskService.getTaskById(newTaskId);
    
    await TaskHistoryService.createTaskHistory(newTaskId, session.id_user, old_status, new_status, action_history, description_history);
    
    return NextResponse.json(newTask, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
