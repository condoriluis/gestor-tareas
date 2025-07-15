import { NextResponse, NextRequest } from 'next/server';
import { UserService } from '../auth/UserService';
import { validateToken } from '@/utils/validateToken';

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener todos los usuarios
 *     description: Endpoint para obtener la lista completa de usuarios (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                   name_user:
 *                     type: string
 *                   email_user:
 *                     type: string
 *                   status_user:
 *                     type: number
 *                   rol_user:
 *                     type: string
 *                   date_created_user:
 *                     type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener usuarios
 */
export async function GET() {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {

    const users = await UserService.getAllUsers();
    return NextResponse.json(users, { status: 200 });

  } catch (error) {

    return NextResponse.json({ message: 'Error al obtener usuarios' }, { status: 500 });

  }
}

/**
 * @swagger
 * /api/users:
 *   patch:
 *     tags: [Usuarios]
 *     summary: Actualizar estado de usuario
 *     description: Endpoint para actualizar el estado de un usuario (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUser
 *               - status
 *             properties:
 *               idUser:
 *                 type: integer
 *                 description: ID del usuario a actualizar
 *                 example: 0
 *               status:
 *                 type: number
 *                 enum: [1, 0]
 *                 description: Nuevo estado del usuario
 *                 example: 1
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al actualizar el estado
 */
export async function PATCH(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { idUser, status } = await request.json();

    const updatedUser = await UserService.getUserById(idUser);

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    await UserService.updateUserStatus(idUser, status);
    
    return NextResponse.json(
      { message: 'Estado actualizado correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar datos de usuario
 *     description: Endpoint para actualizar los datos de un usuario (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUser
 *               - name
 *               - email
 *               - rol
 *             properties:
 *               idUser:
 *                 type: integer
 *                 description: ID del usuario a actualizar
 *                 example: 0
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 description: Nuevo correo electrónico del usuario
 *                 example: juan.perez@example.com
 *               rol:
 *                 type: string
 *                 enum: [admin, user]
 *                 description: Nuevo rol del usuario
 *                 example: user
 *     responses:
 *       200:
 *         description: Datos actualizados correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al actualizar datos
 */
export async function PUT(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { idUser, name, email, rol } = await request.json();

    const updatedUser = await UserService.getUserById(idUser);

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    await UserService.updateUserData(idUser, { name, email, rol });
    return NextResponse.json(
      { message: 'Datos del usuario actualizados correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar datos del usuario.' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar usuario
 *     description: Endpoint para eliminar un usuario (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUser
 *             properties:
 *               idUser:
 *                 type: integer
 *                 description: ID del usuario a eliminar
 *                 example: 0
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al eliminar usuario
 */
export async function DELETE(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { idUser } = await request.json();

    const deletedUser = await UserService.getUserById(idUser);

    if (!deletedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    await UserService.deleteUser(idUser);
    return NextResponse.json(
      { message: 'Usuario eliminado correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al eliminar usuario.' },
      { status: 500 }
    );
  }
}