import { NextResponse } from 'next/server'
import { db } from '@/lib/db';
import { sendEmail } from '@/utils/mailer';
import { UserService } from '../UserService';

export async function POST(request: Request) {
  const { email } = await request.json()

  try {
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'El correo electrónico no existe en el sistema.' },
        { status: 400 }
      );
    }

    const rawToken = await UserService.storeResetToken(email);
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to: email,
        subject: 'Reestablecimiento de contraseña',
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #1E1E1E; padding: 20px; text-align: center;">
            <h1 style="color: #00E57B; margin: 0;">${process.env.SMTP_FROM_NAME}</h1>
          </div>

          <div style="padding: 30px 20px;">
            <h2 style="color: #1E1E1E; margin-top: 0;">Hola ${user.name || 'usuario'},</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #00E57B; color: #1E1E1E; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Restablecer contraseña
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este mensaje.</p>
          </div>

          <div style="padding: 20px; text-align: center; font-size: 12px; color: #777; background-color: #f8f9fa;">
            <p style="margin: 0;">${new Date().getFullYear()} ${process.env.SMTP_FROM_NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
        `,
      });
    } catch {
      await db.user.update({ where: { id: user.id }, data: { resetToken: null, resetTokenExpiry: null } });
      return NextResponse.json(
        { error: 'No se pudo enviar el correo. Intenta de nuevo más tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: `Instrucciones enviadas con éxito al correo: ${email}` },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error al procesar la solicitud, intenta de nuevo.' },
      { status: 500 }
    );
  }
}
