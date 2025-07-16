export const userPaths = {
    '/api/users': {
        get: {
            tags: ['Usuarios'],
            summary: 'Obtener todos los usuarios',
            description: 'Endpoint para obtener la lista completa de usuarios (solo administradores)',
            operationId: 'getAllUsers',
            security: [{ bearerAuth: [] }],
            responses: {
            200: {
                description: 'Lista de usuarios',
                content: {
                'application/json': {
                    schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                        id_user: { type: 'integer' },
                        name_user: { type: 'string' },
                        email_user: { type: 'string' },
                        status_user: { type: 'number' },
                        rol_user: { type: 'string' },
                        date_created_user: { type: 'string' }
                        }
                    }
                    }
                }
                }
            },
            401: {
                description: 'No autorizado'
            },
            500: {
                description: 'Error al obtener usuarios'
            }
            }
        },

        patch: {
            tags: ['Usuarios'],
            summary: 'Actualizar estado de usuario',
            description: 'Endpoint para actualizar el estado de un usuario (solo administradores)',
            operationId: 'updateUserStatus',
            security: [{ bearerAuth: [] }],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    required: ['idUser', 'status'],
                    properties: {
                    idUser: {
                        type: 'integer',
                        description: 'ID del usuario a actualizar',
                        example: 0
                    },
                    status: {
                        type: 'number',
                        enum: [1, 0],
                        description: 'Nuevo estado del usuario',
                        example: 1
                    }
                    }
                }
                }
            }
            },
            responses: {
            200: {
                description: 'Estado actualizado correctamente'
            },
            401: {
                description: 'No autorizado'
            },
            500: {
                description: 'Error al actualizar el estado'
            }
            }
        },

        put: {
            tags: ['Usuarios'],
            summary: 'Actualizar datos de usuario',
            description: 'Endpoint para actualizar los datos de un usuario (solo administradores)',
            operationId: 'updateUserData',
            security: [{ bearerAuth: [] }],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    required: ['idUser', 'name', 'email', 'rol'],
                    properties: {
                    idUser: {
                        type: 'integer',
                        description: 'ID del usuario a actualizar',
                        example: 0
                    },
                    name: {
                        type: 'string',
                        description: 'Nuevo nombre del usuario',
                        example: 'Juan Pérez'
                    },
                    email: {
                        type: 'string',
                        description: 'Nuevo correo electrónico del usuario',
                        example: 'juan.perez@example.com'
                    },
                    rol: {
                        type: 'string',
                        enum: ['admin', 'user'],
                        description: 'Nuevo rol del usuario',
                        example: 'user'
                    }
                    }
                }
                }
            }
            },
            responses: {
            200: {
                description: 'Datos actualizados correctamente'
            },
            401: {
                description: 'No autorizado'
            },
            500: {
                description: 'Error al actualizar datos'
            }
            }
        },

        delete: {
            tags: ['Usuarios'],
            summary: 'Eliminar usuario',
            description: 'Endpoint para eliminar un usuario (solo administradores)',
            operationId: 'deleteUser',
            security: [{ bearerAuth: [] }],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    required: ['idUser'],
                    properties: {
                    idUser: {
                        type: 'integer',
                        description: 'ID del usuario a eliminar',
                        example: 0
                    }
                    }
                }
                }
            }
            },
            responses: {
            200: {
                description: 'Usuario eliminado correctamente'
            },
            401: {
                description: 'No autorizado'
            },
            500: {
                description: 'Error al eliminar usuario'
            }
            }
        }
    },

};