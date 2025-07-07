import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { TaskService } from './TaskService';

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