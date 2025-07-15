import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { UserService } from '../UserService';

/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     tags: [Autenticación]
 *     summary: Actualización de contraseña
 *     description: Permite a un usuario cambiar su contraseña actual por una nueva
 *     operationId: updatePassword
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Contraseña actual del usuario
 *                 example: contraseñaActual123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Nueva contraseña del usuario
 *                 example: nuevaContraseñaSegura456
 *     responses:
 *       '200':
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada exitosamente.
 *       '401':
 *         description: No autorizado o credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: No autorizado.
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Contraseña actual incorrecta.
 *       '500':
 *         description: Error del servidor
 */

export async function POST(request: Request) {
  const { currentPassword, newPassword } = await request.json(); 
  
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const user = await UserService.getUserById(session.id_user);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado.' },
        { status: 401 }
      );
    }
    
    const passwordMatch = await UserService.verifyPassword(currentPassword, user.password_user);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta.' },
        { status: 401 }
      );
    }
    
    await UserService.updatePassword(session.id_user, newPassword);
    
    return NextResponse.json(
      { message: 'Contraseña actualizada exitosamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar la contraseña.' },
      { status: 500 }
    );
  }
}
