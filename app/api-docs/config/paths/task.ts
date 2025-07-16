export const taskPaths = {
    '/api/tasks': {
        get: {
            tags: ['Tareas'],
            summary: 'Obtener todas las tareas del usuario autenticado',
            description: 'Devuelve la lista de tareas del usuario autenticado',
            operationId: 'getAllTasks',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                description: 'Tareas obtenidas correctamente',
                content: {
                    'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                        type: 'object',
                        properties: {
                            id_task: { type: 'integer', example: 1 },
                            id_user_task: { type: 'integer', example: 1 },
                            title_task: { type: 'string', example: 'Reunión con equipo' },
                            description_task: { type: 'string', example: 'Reunión para discutir proyectos' },
                            status_task: {
                            type: 'string',
                            enum: ['todo', 'in_progress', 'done'],
                            example: 'todo'
                            },
                            priority_task: {
                            type: 'string',
                            enum: ['low', 'medium', 'high'],
                            example: 'medium'
                            },
                            date_start_task: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T09:00:00Z'
                            },
                            date_completed_task: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-02T17:00:00Z'
                            },
                            date_created_task: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T09:00:00Z'
                            },
                            user_name: { type: 'string', example: 'Nombre usuario' }
                        }
                        }
                    }
                    }
                }
                },
                '401': {
                description: 'No autorizado'
                },
                '500': {
                description: 'Error del servidor'
                }
            }
        },

        patch: {
            tags: ['Tareas'],
            summary: 'Actualizar el estado de una tarea',
            description: 'Permite actualizar el estado de una tarea',
            operationId: 'updateTaskStatus',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    required: ['idTask'],
                    properties: {
                        idTask: {
                        type: 'integer',
                        example: 0
                        },
                        title: {
                        type: 'string',
                        example: 'Tarea 1'
                        },
                        priority: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        example: 'medium'
                        },
                        old_status: {
                        type: 'string',
                        example: 'todo'
                        },
                        status: {
                        type: 'string',
                        enum: ['todo', 'in_progress', 'done'],
                        example: 'in_progress'
                        },
                        date_start: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-01-01T10:00:00.000Z'
                        },
                        date_completed: {
                        type: 'string',
                        format: 'date-time',
                        example: null
                        }
                    }
                    }
                }
                }
            },
            responses: {
                '200': {
                description: 'Tarea actualizada exitosamente'
                },
                '401': {
                description: 'No autorizado'
                },
                '500': {
                description: 'Error al actualizar el estado de la tarea'
                }
            }
        }
    },

    '/api/tasks/create': {
        post: {
            tags: ['Tareas'],
            summary: 'Crear una nueva tarea',
            description: 'Crea una nueva tarea en el sistema',
            operationId: 'createTask',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    required: ['title_task', 'description_task', 'priority_task', 'status_task'],
                    properties: {
                        title_task: {
                        type: 'string',
                        example: 'Reunión de equipo'
                        },
                        description_task: {
                        type: 'string',
                        example: 'Discutir los objetivos del sprint'
                        },
                        priority_task: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        example: 'medium'
                        },
                        status_task: {
                        type: 'string',
                        enum: ['todo', 'in_progress', 'done'],
                        example: 'todo'
                        },
                        date_start_task: {
                        type: 'string',
                        format: 'date-time',
                        example: null
                        },
                        date_completed_task: {
                        type: 'string',
                        format: 'date-time',
                        example: null
                        }
                    }
                    }
                }
                }
            },
            responses: {
                '201': {
                description: 'Tarea creada exitosamente',
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                        id_task: { type: 'integer', example: 1 },
                        id_user_task: { type: 'integer', example: 1 },
                        title_task: { type: 'string', example: 'Tarea de ejemplo' },
                        description_task: { type: 'string', example: 'Descripción de ejemplo' },
                        priority_task: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
                        status_task: { type: 'string', enum: ['todo', 'in_progress', 'done'], example: 'todo' },
                        date_start_task: { type: 'string', format: 'date-time', example: null },
                        date_completed_task: { type: 'string', format: 'date-time', example: null },
                        date_created_task: { type: 'string', format: 'date-time', example: '2025-01-01T09:00:00.000Z' },
                        user_name: { type: 'string', example: 'Nombre usuario' }
                        }
                    }
                    }
                }
                },
                '401': { description: 'No autorizado' },
                '500': { description: 'Error del servidor' }
            }
        }
    },

    '/api/tasks/{id}': {
        put: {
            tags: ['Tareas'],
            summary: 'Actualizar una tarea',
            description: 'Endpoint para actualizar los detalles de una tarea existente',
            operationId: 'updateTaskId',
            security: [{ bearerAuth: [] }],
            parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'ID de la tarea a actualizar'
            }
            ],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    title: {
                        type: 'string',
                        description: 'Nuevo título de la tarea',
                        example: 'Reunión actualizada'
                    },
                    description: {
                        type: 'string',
                        description: 'Nueva descripción',
                        example: 'Discutir objetivos revisados'
                    },
                    priority: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        description: 'Nueva prioridad',
                        example: 'medium'
                    }
                    }
                }
                }
            }
            },
            responses: {
            200: {
                description: 'Tarea actualizada exitosamente',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        id_user: { type: 'integer' },
                        id_user_task: { type: 'integer' },
                        title_task: { type: 'string' },
                        description_task: { type: 'string' },
                        priority_task: { type: 'string' },
                        status_task: { type: 'string' },
                        date_start_task: { type: 'string' },
                        date_completed_task: { type: 'string' },
                        user_name: { type: 'string' }
                    }
                    }
                }
                }
            },
            400: { description: 'Datos inválidos' },
            401: { description: 'No autorizado' },
            500: { description: 'Error al actualizar la tarea' }
            }
        },

        get: {
            tags: ['Tareas'],
            summary: 'Obtener tareas por ID de usuario',
            description: 'Endpoint para obtener los detalles de tareas por ID de usuario',
            operationId: 'getTaskById',
            security: [{ bearerAuth: [] }],
            parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: {
                type: 'integer'
                },
                description: 'ID de usuario'
            }
            ],
            responses: {
            200: {
                description: 'Detalles de la tarea',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        id_user: { type: 'integer' },
                        id_user_task: { type: 'integer' },
                        title_task: { type: 'string' },
                        description_task: { type: 'string' },
                        priority_task: { type: 'string' },
                        status_task: { type: 'string' },
                        date_start_task: { type: 'string' },
                        date_completed_task: { type: 'string' },
                        user_name: { type: 'string' }
                    }
                    }
                }
                }
            },
            400: { description: 'ID de usuario no proporcionado' },
            401: { description: 'No autorizado' },
            500: { description: 'Error interno del servidor' }
            }
        },

        delete: {
            tags: ['Tareas'],
            summary: 'Eliminar una tarea',
            description: 'Endpoint para eliminar una tarea existente',
            operationId: 'deleteTask',
            security: [{ bearerAuth: [] }],
            parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'ID de la tarea a eliminar'
            }
            ],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    titleTask: { type: 'string' },
                    priorityTask: { type: 'string' },
                    statusTask: { type: 'string' }
                    }
                }
                }
            }
            },
            responses: {
            204: {
                description: 'Tarea eliminada exitosamente'
            },
            400: {
                description: 'ID de tarea no proporcionado'
            },
            401: {
                description: 'No autorizado'
            },
            500: {
                description: 'Error al eliminar la tarea'
            }
            }
        }
    }
};