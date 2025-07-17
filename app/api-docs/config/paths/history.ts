export const historyPaths = {
    '/api/history': {
        get: {
            tags: ['Historial'],
            summary: 'Obtener historial de acciones del usuario autenticado',
            description: 'Endpoint para obtener el historial completo de acciones realizadas en tareas por el usuario autenticado',
            operationId: 'getHistory',
            security: [{ bearerAuth: [] }],
            responses: {
            200: {
                description: 'Lista de acciones del historial de acciones',
                content: {
                'application/json': {
                    schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                        id_history: { type: 'integer' },
                        id_task_history: { type: 'integer' },
                        id_user_history: { type: 'integer' },
                        old_status: { type: 'string' },
                        new_status: { type: 'string' },
                        action_history: { type: 'string' },
                        description_history: { type: 'string' },
                        date_created_history: { type: 'string' },
                        user_name: { type: 'string' }
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
                description: 'Error al obtener el historial'
            }
            }
        }
    },

    '/api/history/{id}': {
        get: {
            tags: ['Historial'],
            summary: 'Obtener historial de tarea por ID de usuario',
            description: 'Endpoint para obtener el historial de acciones de tarea por ID de usuario',
            operationId: 'getHistoryById',
            security: [{ bearerAuth: [] }],
            parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'ID de usuario'
            }
            ],
            responses: {
            200: {
                description: 'Historial de la tarea',
                content: {
                'application/json': {
                    schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                        id_history: { type: 'integer' },
                        id_task_history: { type: 'integer' },
                        id_user_history: { type: 'integer' },
                        old_status: { type: 'string' },
                        new_status: { type: 'string' },
                        action_history: { type: 'string' },
                        description_history: { type: 'string' },
                        date_created_history: { type: 'string' },
                        user_name: { type: 'string' }
                        }
                    }
                    }
                }
                }
            },
            400: { description: 'ID de tarea no proporcionado' },
            401: { description: 'No autorizado' },
            500: { description: 'Error al obtener el historial' }
            }
        },

        delete: {
            tags: ['Historial'],
            summary: 'Eliminar historial de tareas',
            description: 'Elimina un historial específico o todo el historial del usuario por ID de usuario',
            operationId: 'deleteHistory',
            security: [{ bearerAuth: [] }],
            parameters: [
            {
                in: 'path',
                name: 'id',
                required: false,
                schema: { type: 'integer' },
                description: 'ID de usuario'
            },
            {
                in: 'query',
                name: 'id_history',
                schema: { type: 'integer' },
                description: 'ID del historial a eliminar'
            }
            ],
            responses: {
            200: {
                description: 'Operación exitosa',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string', description: 'Mensaje descriptivo de la operación realizada' }
                    }
                    }
                }
                }
            },
            400: { description: 'ID de usuario no proporcionado' },
            401: { description: 'No autorizado' },
            500: { description: 'Error al eliminar el historial' }
            }
        }
    }  
};