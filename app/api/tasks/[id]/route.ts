import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskService } from '../TaskService';
import { UserService } from '../../auth/UserService';
import { TaskHistoryService } from '../../tasks/TaskHistoryService';

// Obtener una tarea por ID (GET /api/tasks/[id])
export const GET = async (request: Request, { params }: { params: { id: number } }) => {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }

    const task = await TaskService.getAllTasks(id);

    return NextResponse.json(task, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

// Actualizar una tarea (PUT /api/tasks/[id])
export const PUT = async (request: Request, { params }: { params: { id: number } }) => {

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
    const { type } = body;

    if (!type) {
      return NextResponse.json({ message: 'El campo type es obligatorio' }, { status: 400 });
    }

    const user = await UserService.getUserById(session.id_user);

    if (type === 'edit') {
      const { title, description, priority, 
        old_status, new_status, action_history, description_history } = body; 
        
      await TaskService.updateTask(session.id_user, user.rol_user, id, title, description, priority);
      await TaskHistoryService.createTaskHistory(id, session.id_user, old_status, new_status, action_history, description_history);
    
    } 
    else if (type === 'status') {
      const { status, date_start, date_completed,
        old_status, new_status, action_history, description_history } = body;

      await TaskService.updateTaskStatus(session.id_user, user.rol_user, id, status, date_start, date_completed);
      await TaskHistoryService.createTaskHistory(id, session.id_user, old_status, new_status, action_history, description_history);
    } 

    else {
      return NextResponse.json({ message: 'Tipo de operación inválido' }, { status: 400 });
    }

    const updatedTask = await TaskService.getTaskById(id);

    return NextResponse.json(updatedTask, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
};

// Eliminar una tarea (DELETE /api/tasks/[id])
export const DELETE = async (request: Request, { params }: { params: { id: number } }) => {

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
    const { old_status, new_status, action_history, description_history } = body;
   
    const deletedRows = await TaskService.deleteTask(id);

    if (deletedRows === 0) {
      return NextResponse.json({ message: 'Tarea no encontrada' }, { status: 404 });
    }

    await TaskHistoryService.createTaskHistory(id, session.id_user, old_status, new_status, action_history, description_history);
    return NextResponse.json({ message: 'Tarea eliminada correctamente.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}