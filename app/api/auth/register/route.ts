import { NextResponse, NextRequest } from 'next/server';
import { UserService } from '../UserService';
import { rateLimit } from '@/utils/rateLimit';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registro de nuevo usuario
 *     description: Crea una nueva cuenta de usuario con rol 'user' (o 'admin' si no existe ninguno)
 *     operationId: registerUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nombre Completo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nuevo@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: contraseñaSegura123
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente
 *         headers:
 *           RateLimit-Remaining:
 *             description: Límite de solicitudes restantes
 *             type: integer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente.
 *       '400':
 *         description: Datos inválidos o correo ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El correo electrónico ya existe en el sistema.
 *       '429':
 *         description: Demasiadas solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Demasiadas solicitudes. Intente nuevamente en 60 segundos.
 *       '500':
 *         description: Error del servidor
 */

export async function POST(request: NextRequest) {
  
  const limit = rateLimit(request);
  if (limit.limited) {
    return NextResponse.json(
      { error: `Demasiadas solicitudes. Intente nuevamente en ${limit.remainingTime} segundos.` },
      { status: 429 }
    );
  }

  const { email, password, name } = await request.json();
  
  const status = 1;
  let rolUser = 'user';
  const existingAdmin = await UserService.getUserByRol('admin');

  if (!existingAdmin || existingAdmin.length === 0) {
    rolUser = 'admin'; 
  }

  try {
    const existingUser = await UserService.getUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo electrónico ya existe en el sistema.' },
        { status: 400 }
      );
    }

    if(password.trim().length < 6){
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 401 }
      );
    }
    
    await UserService.createUser(email, password, name, status, rolUser);

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente.' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
