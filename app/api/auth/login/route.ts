import { NextResponse } from 'next/server';
import { UserService } from '../UserService';
import { signJwtAccessToken } from '@/utils/jwt';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Inicio de sesión de usuario
 *     description: Autentica un usuario y genera un JWT token de acceso
 *     operationId: loginUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: contraseñaSegura123
 *     responses:
 *       '200':
 *         description: Autenticación exitosa
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
 *                   example: Nombre usuario
 *                 email_user:
 *                   type: string
 *                   example: usuario@ejemplo.com
 *                 status_user:
 *                   type: integer
 *                   example: 1
 *                 rol_user:
 *                   type: string
 *                   enum: [user, admin]
 *                   example: user
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '400':
 *         description: Datos de entrada inválidos
 *       '401':
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Credenciales inválidas.
 *       '500':
 *         description: Error del servidor
 */

export async function POST(request: Request) {

  try {

    const body = await request.json();
    const { email, password } = body;

    const user = await UserService.getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }
    
    const passwordMatch = await UserService.verifyPassword(password, user.password_user);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }
    
    const { password_user, ...userWithoutPass } = user;
    const accessToken = await signJwtAccessToken(userWithoutPass);
    
    const response = NextResponse.json({
      ...userWithoutPass,
      accessToken,
    });
    
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 2,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor, revise su conexión' },
      { status: 500 }
    );
  }
}
