import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskService } from '../TaskService';
import { UserService } from '../../auth/UserService';
import { TaskHistoryService } from '../../tasks/TaskHistoryService';

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const session = await validateToken();

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { id } = (await params);

    if (!id) {
      return NextResponse.json({ message: 'ID de usuario es necesario' }, { status: 400 });
    }

    const targetUserId = parseInt(id);
    if (session.id !== targetUserId && session.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    }

    const tasks = await TaskService.getAllTasks(targetUserId);

    return NextResponse.json(tasks, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

export const PUT = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const session = await validateToken();

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }

    const task = await TaskService.getTaskById(parseInt(id));

    if (!task) {
      return NextResponse.json({ message: `Tarea con ID:${id} no fue encontrada` }, { status: 404 });
    }

    const user = await UserService.getUserById(session.id);

    const body = await request.json();
    const { title, description, priority } = body;

    let prioridad = '';
    let estado = '';
    if (priority === 'low') prioridad = 'Baja';
    if (priority === 'medium') prioridad = 'Media';
    if (priority === 'high') prioridad = 'Alta';

    if (task.status === 'todo') estado = 'To-do';
    if (task.status === 'in_progress') estado = 'En progreso';
    if (task.status === 'done') estado = 'Completado';

    const action_history = 'Tarea editada';
    const description_history = `${title} con prioridad: ${prioridad} y estado: ${estado}`;

    await TaskService.updateTask(session.id, user?.rol ?? 'user', parseInt(id), title, description, priority);
    await TaskHistoryService.createTaskHistory(parseInt(id), session.id, '', '', action_history, description_history);

    const updatedTask = await TaskService.getTaskById(parseInt(id));
    return NextResponse.json(updatedTask, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
};

export const DELETE = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const session = await validateToken();

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }

    const task = await TaskService.getTaskById(parseInt(id));

    if (!task) {
      return NextResponse.json({ message: `Tarea con ID:${id} no fue encontrada` }, { status: 404 });
    }

    const user = await UserService.getUserById(session.id);

    let prioridad = '';
    let estado = '';
    if (task.priority === 'low') prioridad = 'Baja';
    if (task.priority === 'medium') prioridad = 'Media';
    if (task.priority === 'high') prioridad = 'Alta';

    if (task.status === 'todo') estado = 'To-do';
    if (task.status === 'in_progress') estado = 'En progreso';
    if (task.status === 'done') estado = 'Completado';

    const action_history = 'Tarea eliminada';
    const description_history = `${task.title} con prioridad: ${prioridad}, estado: ${estado} y ID Tarea: ${task.id}`;

    const deletedRows = await TaskService.deleteTask(task.id, session.id, user?.rol ?? 'user');

    if (deletedRows === 0) {
      return NextResponse.json({ message: 'Tarea no encontrada' }, { status: 404 });
    }

    await TaskHistoryService.createTaskHistory(parseInt(id), session.id, '', '', action_history, description_history);
    return NextResponse.json({ message: 'Tarea eliminada correctamente.' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
