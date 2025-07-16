export const authPaths = {
    '/api/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Inicio de sesión de usuario',
        description: 'Autentica un usuario y genera un JWT token de acceso',
        operationId: 'loginUser',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
                  password: { type: 'string', format: 'password', example: 'contraseñaSegura123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Autenticación exitosa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id_user: { type: 'integer', example: 1 },
                    name_user: { type: 'string', example: 'Nombre usuario' },
                    email_user: { type: 'string', example: 'usuario@ejemplo.com' },
                    status_user: { type: 'integer', example: 1 },
                    rol_user: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' }
                  }
                }
              }
            }
          },
          '400': { description: 'Datos inválidos' },
          '401': {
            description: 'Credenciales inválidas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string', example: 'Credenciales inválidas.' } }
                }
              }
            }
          },
          '500': { description: 'Error del servidor' }
        }
      }
    },

    '/api/auth/register': {
        post: {
        tags: ['Autenticación'],
        summary: 'Registro de usuario',
        description: 'Crea una nueva cuenta de usuario con rol user (o admin si no existe ninguno.)',
        operationId: 'registerUser',
        requestBody: {
            required: true,
            content: {
            'application/json': {
                schema: {
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', example: 'Nombre usuario' },
                    email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
                    password: { type: 'string', minLength: 8, example: 'contraseñaSegura123' }
                }
                }
            }
            }
        },
        responses: {
            '201': {
            description: 'Usuario registrado',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    message: { type: 'string', example: 'Usuario registrado exitosamente.' }
                    }
                }
                }
            }
            },
            '400': {
            description: 'Correo ya registrado',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: { type: 'string', example: 'El correo electrónico ya existe.' }
                    }
                }
                }
            }
            },
            '500': { description: 'Error del servidor' }
        }
        }
    },
    
    '/api/auth/logout': {
        post: {
        tags: ['Autenticación'],
        summary: 'Cerrar sesión',
        description: 'Elimina el token JWT del usuario.',
        operationId: 'logoutUser',
        security: [{ bearerAuth: [] }],
        responses: {
            '200': {
            description: 'Sesión cerrada correctamente',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    message: { type: 'string', example: 'Sesión cerrada correctamente.' }
                    }
                }
                }
            }
            },
            '500': {
            description: 'Error al cerrar sesión',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: { type: 'string', example: 'Error al cerrar sesión.' }
                    }
                }
                }
            }
            }
        }
        }
    },

    '/api/auth/forgot': {
        post: {
        tags: ['Autenticación'],
        summary: 'Recuperar contraseña',
        description: 'Envía una contraseña temporal al correo del usuario.',
        operationId: 'forgotPassword',
        requestBody: {
            required: true,
            content: {
            'application/json': {
                schema: {
                required: ['email'],
                properties: {
                    email: {
                    type: 'string',
                    format: 'email',
                    example: 'usuario@ejemplo.com'
                    }
                }
                }
            }
            }
        },
        responses: {
            '200': {
            description: 'Correo enviado exitosamente',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    message: {
                        type: 'string',
                        example: 'Se ha enviado una nueva contraseña a tu correo electrónico.'
                    }
                    }
                }
                }
            }
            },
            '400': {
            description: 'Correo no registrado',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: {
                        type: 'string',
                        example: 'El correo electrónico no existe en el sistema.'
                    }
                    }
                }
                }
            }
            },
            '500': {
            description: 'Error del servidor',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: {
                        type: 'string',
                        example: 'Error al enviar el correo electrónico.'
                    }
                    }
                }
                }
            }
            }
        }
        }
    },

    '/api/auth/update-password': {
        post: {
        tags: ['Autenticación'],
        summary: 'Actualizar contraseña',
        description: 'Permite al usuario cambiar su contraseña actual.',
        operationId: 'updatePassword',
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
            'application/json': {
                schema: {
                required: ['currentPassword', 'newPassword'],
                properties: {
                    currentPassword: {
                    type: 'string',
                    format: 'password',
                    example: 'contraseñaActual123'
                    },
                    newPassword: {
                    type: 'string',
                    format: 'password',
                    minLength: 6,
                    example: 'nuevaContraseñaSegura456'
                    }
                }
                }
            }
            }
        },
        responses: {
            '200': {
            description: 'Contraseña actualizada exitosamente',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    message: {
                        type: 'string',
                        example: 'Contraseña actualizada exitosamente.'
                    }
                    }
                }
                }
            }
            },
            '401': {
            description: 'No autorizado o contraseña incorrecta',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: {
                        type: 'string',
                        example: 'Contraseña actual incorrecta.'
                    }
                    }
                }
                }
            }
            },
            '500': {
            description: 'Error del servidor',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: {
                        type: 'string',
                        example: 'Error interno del servidor.'
                    }
                    }
                }
                }
            }
            }
        }
        }
    },

    '/api/auth/me': {
        get: {
        tags: ['Autenticación'],
        summary: 'Obtener usuario actual',
        description: 'Retorna los datos del usuario autenticado mediante JWT.',
        operationId: 'getCurrentUser',
        security: [{ bearerAuth: [] }],
        responses: {
            '200': {
            description: 'Usuario autenticado',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    id_user: { type: 'integer', example: 1 },
                    name_user: { type: 'string', example: 'Nombre Usuario' },
                    email_user: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
                    status_user: { type: 'integer', example: 1 },
                    rol_user: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                    date_created_user: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' }
                    }
                }
                }
            }
            },
            '401': {
            description: 'No autorizado',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: { type: 'string', example: 'No autorizado, token no encontrado.' }
                    }
                }
                }
            }
            },
            '500': {
            description: 'Error interno',
            content: {
                'application/json': {
                schema: {
                    properties: {
                    error: { type: 'string', example: 'Error al verificar el token.' }
                    }
                }
                }
            }
            }
        }
        }
    } 
      
};
  