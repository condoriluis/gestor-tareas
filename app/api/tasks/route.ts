import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { TaskService } from './TaskService';
import { UserService } from '../auth/UserService';
import { nowBolivia, toBoliviaDateTime } from '@/utils/dateService';
import { TaskHistoryService } from './TaskHistoryService';

export async function GET() {
  const session = await validateToken();

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const tasks = await TaskService.getAllTasks(session.id);
    return NextResponse.json(tasks, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Error al obtener tareas' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await validateToken();

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const user = await UserService.getUserById(session.id);

    const body = await request.json();
    const { taskId, newStatus } = body;

    const task = await TaskService.getTaskById(parseInt(taskId));

    if (!task) {
      return NextResponse.json({ message: `Tarea con ID:${taskId} no fue encontrada` }, { status: 404 });
    }

    if (task.status === newStatus) {
      return NextResponse.json(task, { status: 200 });
    }

    let prioridad = '';
    if (task.priority === 'low') prioridad = 'Baja';
    if (task.priority === 'medium') prioridad = 'Media';
    if (task.priority === 'high') prioridad = 'Alta';

    const action_history = 'Estado cambiado';
    const description_history = `Tarea: ${task.title} con prioridad: ${prioridad}`;

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
      dateStart = task.startDate
        ? toBoliviaDateTime(task.startDate.toISOString())
        : nowBolivia();

      dateCompleted = nowBolivia();
    }

    const updateStatusTask = await TaskService.updateTaskStatus(session.id, user?.rol ?? 'user', taskId, newStatus, dateStart, dateCompleted);

    if (updateStatusTask) {
      await TaskHistoryService.createTaskHistory(taskId, session.id, task.status ?? '', newStatus, action_history, description_history);
    }

    const getUpdatedStatusTask = await TaskService.getTaskById(taskId);
    return NextResponse.json(getUpdatedStatusTask, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Error al actualizar el estado de la tarea' },
      { status: 500 }
    );
  }
}
