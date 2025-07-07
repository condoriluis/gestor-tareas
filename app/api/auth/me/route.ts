import { NextResponse } from 'next/server';
import { verifyJwt } from '@/utils/jwt';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('token')?.value;
  
  if (!accessToken) {
    return NextResponse.json(
      { error: 'No autorizado.' },
      { status: 401 }
    );
  }

  try {
    const user = await verifyJwt(accessToken);
    
    if (!user) {
      return NextResponse.json(
        { error: 'El token es inválido.' },
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
