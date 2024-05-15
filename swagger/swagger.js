const swaggerJSDoc = require('swagger-jsdoc');

// определение метаданных Swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Руководство программиста js',
            description: 'Описание вашего API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'], // путь к вашим маршрутам Express
};

// инициализация Swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;