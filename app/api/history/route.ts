import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { TaskHistoryService } from '../tasks/TaskHistoryService';

export async function GET() {
  const session = await validateToken();

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const tasks = await TaskHistoryService.getAllTaskHistory(session.id);
    return NextResponse.json(tasks, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Error al obtener tareas' },
      { status: 500 }
    );
  }
}
