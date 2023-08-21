require('rootpath')();
require("dotenv").config()
const express = require('express');
// const  logger  = require('')
const app = express();
const cors = require('cors');
const logger = require('./logger')
const db = require('./_helpers/db')
const errorHandler = require('_middleware/error-handler');
const checkSqlInjection = require('./_middleware/checkSqlInjection');
const api = require('./api');
const { connect } = require('./_helpers/mongodb');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
db;

// Use morgan middleware with the custom format
// api routes
// app.use(checkSqlInjection());
app.use(process.env.BASE_URL, api({ express, logger }));
// global error handler
app.use(errorHandler);
// start server
// connect()
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
