import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskHistoryService } from '../../tasks/TaskHistoryService';
import { UserService } from '../../auth/UserService';

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

    const task = await TaskHistoryService.getAllTaskHistory(parseInt(id));

    return NextResponse.json(task, { status: 200 }); 

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

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

    const { searchParams } = new URL(request.url);
    const id_history = searchParams.get('id_history');
    
    if (id_history) {

      await TaskHistoryService.deleteSingleTaskHistory(parseInt(id_history));
      return NextResponse.json({ success: true, message: 'Elemento del historial eliminado correctamente' });

    } else {
      
      const id_user = parseInt(id);
      const deletedHistoryUser = await UserService.getUserById(id_user);
      
      if (!deletedHistoryUser) {
        return NextResponse.json(
          { message: 'Usuario no encontrado.' },
          { status: 404 }
        );
      }
          
      await TaskHistoryService.deleteAllTaskHistory(id_user);
      return NextResponse.json({ success: true, message: 'Historial completo eliminado correctamente' });

    }

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}