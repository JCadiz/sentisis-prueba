import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

/**
 * Configuración de Swagger para documentación de la API
 */

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Sentisis Test API',
        version: '1.0.0',
        description: 'API REST desarrollada con TypeScript, Express y MongoDB aplicando Clean Architecture',
        contact: {
            name: 'Jesus Cadiz',
            email: 'jesuscadiz22@gmail.com',
        },
        license: {
            name: 'ISC',
            url: 'https://opensource.org/licenses/ISC',
        },
    },
    servers: [
        {
            url: `http://localhost:${config.port}`,
            description: 'Servidor de desarrollo',
        },
        {
            url: 'https://api-production.com',
            description: 'Servidor de producción',
        },
    ],
    components: {
        schemas: {
            Task: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439011',
                    },
                    titulo: {
                        type: 'string',
                        maxLength: 200,
                        example: 'Comprar víveres',
                    },
                    descripcion: {
                        type: 'string',
                        maxLength: 1000,
                        example: 'Ir al supermercado y comprar frutas y verduras',
                    },
                    estatus: {
                        type: 'boolean',
                        example: false,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-11-14T10:00:00.000Z',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-11-14T10:00:00.000Z',
                    },
                    completedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: null,
                    },
                    schema_version: {
                        type: 'number',
                        example: 0,
                    },
                },
            },
        },
        responses: {
            NotFoundError: {
                description: 'Recurso no encontrado',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: {
                                    type: 'string',
                                    example: 'Resource not found',
                                },
                            },
                        },
                    },
                },
            },
            BadRequestError: {
                description: 'Petición inválida',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: {
                                    type: 'string',
                                    example: 'Bad request',
                                },
                            },
                        },
                    },
                },
            },
            InternalServerError: {
                description: 'Error interno del servidor',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: {
                                    type: 'string',
                                    example: 'Internal Server Error',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'Tasks',
            description: 'Gestión de tareas (TODO list)',
        },
    ],
};

const options: swaggerJsdoc.Options = {
    definition: swaggerDefinition,
    // Rutas a los archivos que contienen anotaciones de Swagger
    apis: [
        './src/interfaces/http/routes/*.ts',
        './src/interfaces/http/controllers/*.ts',
    ],
};

export const swaggerSpecs = swaggerJsdoc(options);
