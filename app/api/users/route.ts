import { NextResponse, NextRequest } from 'next/server';
import { UserService } from '../auth/UserService';
import { validateToken } from '@/utils/validateToken';

export async function GET() {

  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {

    const users = await UserService.getAllUsers();
    return NextResponse.json(users, { status: 200 });

  } catch (error) {

    return NextResponse.json({ message: 'Error al obtener usuarios' }, { status: 500 });

  }
}

export async function PATCH(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { idUser, status } = await request.json();

    const updatedUser = await UserService.getUserById(idUser);

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    await UserService.updateUserStatus(idUser, status);
    
    return NextResponse.json(
      { message: 'Estado actualizado correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { idUser, name, email, rol } = await request.json();

    const updatedUser = await UserService.getUserById(idUser);

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    await UserService.updateUserData(idUser, { name, email, rol });
    return NextResponse.json(
      { message: 'Datos del usuario actualizados correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar datos del usuario.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await validateToken()

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const { idUser } = await request.json();

    const deletedUser = await UserService.getUserById(idUser);

    if (!deletedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    await UserService.deleteUser(idUser);
    return NextResponse.json(
      { message: 'Usuario eliminado correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al eliminar usuario.' },
      { status: 500 }
    );
  }
}