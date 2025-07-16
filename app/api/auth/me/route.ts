import { NextResponse } from 'next/server';
import { verifyJwt } from '@/utils/jwt';
import { NextRequest } from 'next/server';

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
