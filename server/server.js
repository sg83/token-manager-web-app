const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const config = require('./config');
const db = require('./db/db');

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Token Manager REST API Documentation',
    version: '1.0.0',
    description: 'REST API application for API Token Manager application. ',
    contact: {
      name: 'Snehal Gavali'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local'
    },
  ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/userRoutes.js','./routes/tokenRoutes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Enable bodyparser to parse incoming request body 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Setup routes for APIs and Swagger
const tokenRoutes = require('./routes/tokenRoutes');
const userRoutes = require('./routes/userRoutes');
app.use("/api/token", tokenRoutes);
app.use("/api/user", userRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((request, response, next) => {
  const error = new Error( "Invalid URL");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status( error.status || 500 );
  response.json({
    error: {
      message: error.message
    }
  });
});

// Connect to mongodb
db.connectMongodb().then(() => {
  app.listen(config.SERVER_PORT);
});

module.exports = app;
