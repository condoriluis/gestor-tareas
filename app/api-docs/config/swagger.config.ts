import { authPaths } from './paths/auth';
import { taskPaths } from './paths/task';
import { userPaths } from './paths/user';
import { historyPaths } from './paths/history';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Documentación API de Gestor de Tareas', 
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
      url: process.env.NODE_ENV === 'production'
        ? 'https://gestor-tareas-luis.vercel.app'
        : 'http://localhost:3000',
      description: 'Servidor actual'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Autenticación mediante JWT. Ejemplo: `Authorization: Bearer {token}`'
      }
    }
  },
  security: [
    { bearerAuth: [] }
  ],
  
  paths: {
    ...authPaths,
    ...taskPaths,
    ...userPaths,
    ...historyPaths,
  }
};

export const swaggerSpec = {
  swaggerDefinition,
  apis: []
};
