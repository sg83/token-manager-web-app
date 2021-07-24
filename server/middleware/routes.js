const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
    apis: ['./../routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const tokenRoutes = require('./../routes/tokenRoutes');
const userRoutes = require('./../routes/userRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/token", tokenRoutes);
app.use("/api/user", userRoutes);
app.use('/docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  const error = new Error( "URL not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
