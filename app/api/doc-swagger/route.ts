import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/app/api-docs/config/swagger.config';

export async function GET() {
  try {

    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SWAGGER !== 'true') {
      return NextResponse.json(
        { error: 'Documentación no disponible en producción' },
        { status: 403 }
      );
    }

    return NextResponse.json(swaggerSpec.swaggerDefinition);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error generando documentación' },
      { status: 500 }
    );
  }
}
