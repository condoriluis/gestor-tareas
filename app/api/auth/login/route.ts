import { NextResponse } from 'next/server';
import { UserService } from '../UserService';
import { signJwtAccessToken } from '@/utils/jwt';

export async function POST(request: Request) {

  try {

    const body = await request.json();
    const { email, password } = body;

    const user = await UserService.getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
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
