import { NextResponse } from 'next/server';
import { verifyJwt } from '@/utils/jwt';
import { NextRequest } from 'next/server';

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Autenticación]
 *     summary: Obtiene información del usuario actual
 *     description: Devuelve los datos del usuario autenticado basado en el token JWT
 *     operationId: getCurrentUser
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                   type: integer
 *                   example: 1
 *                 name_user:
 *                   type: string
 *                   example: Nombre Usuario
 *                 email_user:
 *                   type: string
 *                   format: email
 *                   example: usuario@ejemplo.com
 *                 status_user:
 *                   type: integer
 *                   example: 1
 *                 rol_user:
 *                   type: string
 *                   enum: [user, admin]
 *                   example: user
 *                 date_created_user:
 *                   type: string
 *                   format: date
 *                   example: 2025-01-01T00:00:00.000Z
 *       '401':
 *         description: No autorizado (token inválido o no proporcionado)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No autorizado, token no encontrado.
 *       '500':
 *         description: Error al verificar el token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al verificar el token.
 */

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
  
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado, token no encontrado.' },
        { status: 401 }
      );
    }

    const user = await verifyJwt(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido, o expirado.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al verificar el token.' },
      { status: 500 }
    );
  }
}
