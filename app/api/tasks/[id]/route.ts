import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskService } from '../TaskService';
import { UserService } from '../../auth/UserService';
import { TaskHistoryService } from '../../tasks/TaskHistoryService';

// Obtener una tarea por ID (GET /api/tasks/[id])
export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }

    const task = await TaskService.getAllTasks(parseInt(id));

    return NextResponse.json(task, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

// Actualizar una tarea (PUT /api/tasks/[id])
export const PUT = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }
  
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }

    const user = await UserService.getUserById(session.id_user);

    const body = await request.json();
    const { title, description, priority } = body; 

    let prioridad = '';
    let action_history = '';
    let description_history = '';
    let old_status = '';
    let new_status = '';
    
    if (priority === 'low') {
      prioridad = 'Baja';
    }
    if (priority === 'medium') {
      prioridad = 'Media';
    }
    if (priority === 'high') {
      prioridad = 'Alta';
    }

    action_history = 'Tarea editada';
    description_history = `${title} con prioridad: ${prioridad}`;
      
    await TaskService.updateTask(session.id_user, user.rol_user, parseInt(id), title, description, priority);
    await TaskHistoryService.createTaskHistory(parseInt(id), session.id_user, old_status, new_status, action_history, description_history);
    
    const updatedTask = await TaskService.getTaskById(parseInt(id));
    return NextResponse.json(updatedTask, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
};

// Eliminar una tarea (DELETE /api/tasks/[id])
export const DELETE = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }

    const body = await request.json();
    const { titleTask, priorityTask, statusTask } = body;

    let prioridad = '';
    let estado = '';
    let action_history = '';
    let description_history = '';
    let old_status = '';
    let new_status = '';
    
    if (priorityTask === 'low') {
      prioridad = 'Baja';
    }
    if (priorityTask === 'medium') {
      prioridad = 'Media';
    }
    if (priorityTask === 'high') {
      prioridad = 'Alta';
    }
    
    if (statusTask === 'todo') {
      estado = 'To-do';
    }
    if (statusTask === 'in_progress') {
      estado = 'En progreso';
    }
    if (statusTask === 'done') {
      estado = 'Completado';
    }

    action_history = 'Tarea eliminada';
    description_history = `${titleTask} con prioridad: ${prioridad}, estado: ${estado} y ID: ${id}`;
   
    const deletedRows = await TaskService.deleteTask(parseInt(id));

    if (deletedRows === 0) {
      return NextResponse.json({ message: 'Tarea no encontrada' }, { status: 404 });
    }

    await TaskHistoryService.createTaskHistory(parseInt(id), session.id_user, old_status, new_status, action_history, description_history);
    return NextResponse.json({ message: 'Tarea eliminada correctamente.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}