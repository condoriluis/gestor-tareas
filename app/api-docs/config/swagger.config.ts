import { resolve } from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Gestor de Tareas',
    version: '1.0.0',
    description: 'API completa para gestión de tareas con autenticación JWT y roles de usuario',
    contact: {
      name: 'Desarrollador',
      email: 'condori.luis.dev@gmail.com',
      url: 'https://github.com/condoriluis'
    },
    license: {
      name: 'Licencia MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' ? 'https://gestor-tareas-luis.vercel.app' : 'http://localhost:3000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Autenticación mediante JWT. Ejemplo: \\`Authorization: Bearer {token}\\`'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: [
    resolve(process.cwd(), 'app/api/**/*route.ts'),
  ]
};

export const swaggerSpec = options;
