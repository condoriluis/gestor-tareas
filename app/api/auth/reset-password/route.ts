import { NextResponse } from 'next/server'
import { UserService } from '../UserService';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    const user = await UserService.resetPassword(token, password);

    if (!user) {
      return NextResponse.json(
        { error: 'El enlace de restablecimiento no es válido o ha expirado.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Contraseña actualizada correctamente.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
