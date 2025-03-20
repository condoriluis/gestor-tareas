import { NextResponse } from 'next/server';
import { createTask, getAllTasks, getTaskById } from './tasksService';
import { validateTaskData } from './taskValidator';

// Obtener todas las tareas (GET)
export const GET = async () => {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener tareas' }, { status: 500 });
  }
};

// Agregar una nueva tarea (POST)
export const POST = async (req: Request) => {
  try {
    const { title, description, status } = await req.json();

    validateTaskData({ title, description, status });

    const newTaskId = await createTask(title, description, status);

    const newTask = await getTaskById(newTaskId);

    if (!newTask) {
      throw new Error('Error: No se encontró la tarea recién creada');
    }

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error en el POST de /api/tasks:', error);
    return NextResponse.json({ message: 'Error al crear tarea' }, { status: 500 });
  }
};