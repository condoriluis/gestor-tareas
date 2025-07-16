import { NextResponse } from 'next/server';
import { validateToken } from '@/utils/validateToken';
import { UserService } from '../UserService';

export async function POST(request: Request) {
  const { currentPassword, newPassword } = await request.json(); 
  
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const user = await UserService.getUserById(session.id_user);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado.' },
        { status: 401 }
      );
    }
    
    const passwordMatch = await UserService.verifyPassword(currentPassword, user.password_user);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta.' },
        { status: 401 }
      );
    }
    
    await UserService.updatePassword(session.id_user, newPassword);
    
    return NextResponse.json(
      { message: 'Contraseña actualizada exitosamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar la contraseña.' },
      { status: 500 }
    );
  }
}
