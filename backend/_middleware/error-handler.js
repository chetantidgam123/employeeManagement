const logs = require("./logs");

module.exports = errorHandler;

async function errorHandler(err, req, res, next) {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            // logs(req, { status: false, code: statusCode, message: err })
            return res.status(statusCode).json({ status: false, code: statusCode, message: err });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            // logs(req, { status: false, code: 401, message: 'Unauthorized' })
            return res.status(401).json({ status: false, code: 401, message: 'Unauthorized' });
        default:
            // logs(req, { status: false, code: 500, message: err.message })
            return res.status(500).json({ status: false, code: 500, message: err.message });
    }
}