import swaggerJsdoc from 'swagger-jsdoc';

// Swagger setup
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Twitter API with Swagger',
      version: '0.1.0',
      description: 'This is a Restful API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./**/*.ts'],
};

export const specs = swaggerJsdoc(options);
