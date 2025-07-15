import { NextResponse } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerSpec } from '../../api-docs/config/swagger.config';

type SwaggerSpec = {
  paths?: Record<string, any>;
  [key: string]: any;
};

export async function GET() {
  try {

    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SWAGGER !== 'true') {
      return NextResponse.json(
        { error: 'Documentación no disponible en producción' },
        { status: 403 }
      );
    }

    const spec: SwaggerSpec = swaggerJSDoc(swaggerSpec);
    return NextResponse.json(spec);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error generando documentación' },
      { status: 500 }
    );
  }
}
