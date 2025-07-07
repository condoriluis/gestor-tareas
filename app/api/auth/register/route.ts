import { NextResponse, NextRequest } from 'next/server';
import { UserService } from '../UserService';
import { rateLimit } from '@/utils/rateLimit';

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
