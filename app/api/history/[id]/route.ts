import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken'
import { TaskHistoryService } from '../../tasks/TaskHistoryService';
import { UserService } from '../../auth/UserService';

/**
 * @swagger
 * /api/history/{id}:
 *   get:
 *     tags: [Historial]
 *     summary: Obtener historial de tarea por ID de usuario
 *     description: Endpoint para obtener el historial de acciones de tarea por ID de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de usuario
 *     responses:
 *       200:
 *         description: Historial de la tarea
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_history:
 *                     type: integer
 *                   id_task_history:
 *                     type: integer
 *                   id_user_history:
 *                     type: integer
 *                   old_status:
 *                     type: string
 *                   new_status:
 *                     type: string
 *                   action_history:
 *                     type: string
 *                   description_history:
 *                     type: string
 *                   date_created_history:
 *                     type: string
 *                   user_name:
 *                     type: string
 *       400:
 *         description: ID de tarea no proporcionado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener el historial
 */
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

/**
 * @swagger
 * /api/history/{id}:
 *   delete:
 *     tags: [Historial]
 *     summary: Eliminar historial de tareas
 *     description: Endpoint para eliminar historial (un registro específico o todo el historial del usuario)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID de usuario
 *       - in: query
 *         name: id_history
 *         schema:
 *           type: integer
 *         description: ID del registro específico a eliminar (opcional)
 *     responses:
 *       200:
 *         description: Operación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Mensaje descriptivo de la operación realizada
 *       400:
 *         description: ID de usuario no proporcionado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al eliminar el historial
 */
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