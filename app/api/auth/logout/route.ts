import { NextResponse } from 'next/server';

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
