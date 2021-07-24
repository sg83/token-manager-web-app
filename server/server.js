const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require("./middleware/routes")
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
    title: 'API documentation',
    version: '1.0.0',
    description: 'This is a REST API application made with Express. ',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Snehal Gavali'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Enable Bodyparser
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
  app.listen(config.SERVER_PORT, () => {
    console.log('API Token Manager listening on port ' + config.SERVER_PORT);
  });
});

module.exports = app;
