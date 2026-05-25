const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 17000;
const SWAGGER_URL = process.env.SWAGGER_URL || `http://localhost:${PORT}`;

const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'API de Dados - Jogos de Tabuleiro',
        version: '1.0.0',
        description: 'API para consultar informações sobre jogos de tabuleiro.'
    },
    servers: [{ url: SWAGGER_URL, description: 'Servidor local' }],
    paths: {
        '/jogos': {
            get: {
                summary: 'Listar todos os jogos',
                parameters: [
                    { 
                        name: 'editora', 
                        in: 'query', 
                        schema: { type: 'string' },
                        description: 'Filtrar por nome da editora'
                    }
                ],
                responses: { 
                    '200': { description: 'Lista de jogos' }
                }
            },
            post: {
                summary: 'Criar novo jogo',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object' }
                        }
                    }
                },
                responses: { 
                    '201': { description: 'Jogo criado com sucesso' }
                }
            }
        },
        '/jogos/{id}': {
            get: {
                summary: 'Obter jogo por ID',
                parameters: [
                    { 
                        name: 'id', 
                        in: 'path', 
                        required: true, 
                        schema: { type: 'string' },
                        description: 'ID do jogo'
                    }
                ],
                responses: { 
                    '200': { description: 'Informações completas do jogo' },
                    '404': { description: 'Jogo não encontrado' }
                }
            },
            delete: {
                summary: 'Eliminar jogo por ID',
                parameters: [
                    { 
                        name: 'id', 
                        in: 'path', 
                        required: true, 
                        schema: { type: 'string' },
                        description: 'ID do jogo'
                    }
                ],
                responses: { 
                    '200': { description: 'Jogo eliminado com sucesso' },
                    '404': { description: 'Jogo não encontrado' }
                }
            }
        },
        '/autores': {
            get: {
                summary: 'Listar autores',
                description: 'Retorna lista de autores ordenada alfabeticamente com seus jogos',
                responses: { 
                    '200': { description: 'Lista de autores' }
                }
            }
        },
        '/categorias': {
            get: {
                summary: 'Listar categorias',
                description: 'Retorna lista de categorias ordenada alfabeticamente com seus jogos',
                responses: { 
                    '200': { description: 'Lista de categorias' }
                }
            }
        }
    }
};

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
