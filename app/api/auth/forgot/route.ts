import { NextResponse } from 'next/server'
import { sendEmail } from '@/utils/mailer';
import { UserService } from '../UserService';

export async function POST(request: Request) {
  const { email } = await request.json()
  
  try {
    const existingUser = await UserService.getUserByEmail(email);
    
    if (!existingUser) { 
      return NextResponse.json(
        { error: 'El correo electrónico no existe en el sistema.' },
        { status: 400 }
      );
    }
    
    const newPassword = Array.from({length: 12}, () => 
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$_'[
        Math.floor(Math.random() * 65)
      ]
    ).join('');
    
    await UserService.forgotPassword(email, newPassword);
    
    await sendEmail({
      to: email,
      subject: 'Reestablecimiento de contraseña',
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #1E1E1E; padding: 20px; text-align: center;">
          <h1 style="color: #00E57B; margin: 0;">${process.env.SMTP_FROM_NAME}</h1>
        </div>
        
        <div style="padding: 30px 20px; border-bottom: 1px solid #eee;">
          <h2 style="color: #1E1E1E; margin-top: 0;">Hola ${existingUser.name_user || 'usuario'},</h2>
          <p>Hemos recibido una solicitud para reestablecer tu contraseña. Aquí están los detalles:</p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #00E57B; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Tu nueva contraseña temporal:</strong></p>
            <p style="font-size: 18px; font-weight: bold; color: #1E1E1E; margin: 10px 0 0 0;">${newPassword}</p>
          </div>
          
          <p style="margin-bottom: 0;">Por seguridad, recomendamos:</p>
          <ul style="margin-top: 5px; padding-left: 20px;">
            <li>Cambiar esta contraseña al iniciar sesión</li>
            <li>No compartirla con nadie</li>
            <li>Usar una contraseña única</li>
          </ul>
        </div>
        
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #777; background-color: #f8f9fa;">
          <p style="margin: 0;">Si no solicitaste este cambio, por favor contacta a soporte inmediatamente.</p>
          <p style="margin: 10px 0 0 0;">${new Date().getFullYear()} ${process.env.SMTP_FROM_NAME}. Todos los derechos reservados.</p>
        </div>
      </div>
      `
    })

    return NextResponse.json(
      { success: true, message: `Instrucciones enviadas con éxito al correo: ${email}, Por favor revise su bandeja de entrada o bandeja de Spam.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en el proceso de recuperación:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud, intenta de nuevo.' },
      { status: 500 }
    );
  }
}
