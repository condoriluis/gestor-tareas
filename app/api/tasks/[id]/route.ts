import { NextResponse } from 'next/server';
import { getTaskById, updateTask, updateTaskStatus, deleteTask } from '../tasksService';

// Obtener una tarea por ID (GET /api/tasks/[id])
export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    const task = await getTaskById(taskId);
    if (!task) {
      return NextResponse.json({ message: 'Tarea no encontrada' }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// Actualizar una tarea (PUT /api/tasks/[id])
export const PUT = async (req: Request, { params }: { params: { id: number } }) => {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ message: 'Error en el formato del cuerpo de la solicitud' }, { status: 400 });
    }

    const { type } = body;

    if (!type) {
      return NextResponse.json({ message: 'El campo type es obligatorio' }, { status: 400 });
    }

    let updatedRows = 0;

    if (type === 'edit') {
      const { title, description, priority } = body;
      
      if (!title || !description || !priority) {
        return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
      }

      updatedRows = await updateTask(id, title, description, priority);
    } 
    else if (type === 'status') {
      const { status } = body;

      if (!status) {
        return NextResponse.json({ message: 'El campo status es obligatorio' }, { status: 400 });
      }

      updatedRows = await updateTaskStatus(id, status);
    } 
    else {
      return NextResponse.json({ message: 'Tipo de operación inválido' }, { status: 400 });
    }

    if (updatedRows === 0) {
      return NextResponse.json({ message: 'Tarea no encontrada o sin cambios' }, { status: 404 });
    }

    const updatedTask = await getTaskById(id);
    return NextResponse.json(updatedTask, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
};

// Eliminar una tarea (DELETE /api/tasks/[id])
export const DELETE = async (req: Request, { params }: { params: { id: number } }) => {
  try {

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarea es necesario' }, { status: 400 });
    }
   
    const deletedRows = await deleteTask(id);

    if (deletedRows) {
      return NextResponse.json({ message: 'Tarea no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tarea eliminada correctamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}