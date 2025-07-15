import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Autenticación]
 *     summary: Cierre de sesión
 *     description: Invalida el token JWT del usuario actual limpiando las cookies
 *     operationId: logoutUser
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada correctamente.
 *         headers:
 *           Set-Cookie:
 *             description: Cookie de token vaciada
 *             schema:
 *               type: string
 *               example: token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly
 *       '500':
 *         description: Error al cerrar sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al cerrar sesión.
 */

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Sesión cerrada correctamente.' },
      { status: 200 }
    );
    
    response.cookies.set({
      name: 'token',
      httpOnly: true,
      value: '',
      expires: new Date(0),
      path: '/',
      maxAge: 0,
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al cerrar sesión.' },
      { status: 500 }
    );
  }
}
