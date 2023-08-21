const express = require('express')
const errorHandler = require('_middleware/error-handler');
const user = require('./controller/user')
const models = require('./model')
const routersInit = (config) => {
    const router = express.Router();
    router.use('/users', user(models, { config }))
    // catch api all errors
    router.use(errorHandler);
    return router;
}

module.exports = routersInit;