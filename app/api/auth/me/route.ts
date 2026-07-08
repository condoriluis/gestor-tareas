import { NextResponse } from 'next/server';
import { verifyJwt } from '@/utils/jwt';
import { NextRequest } from 'next/server';
import { UserService } from '../UserService';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado, token no encontrado.' },
        { status: 401 }
      );
    }

    const payload = await verifyJwt(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido, o expirado.' },
        { status: 401 }
      );
    }

    const user = await UserService.getUserById(payload.id);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    const { password: _, ...userWithoutPass } = user;

    return NextResponse.json(userWithoutPass);
  } catch {
    return NextResponse.json(
      { error: 'Error al verificar el token.' },
      { status: 500 }
    );
  }
}
