const logs = require("./logs");

module.exports = { validateRequest, validatequeryParams };

async function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        let err = await error.details.map(x => x.message.replaceAll('"', '')).join(', ')
        next({ 'status': false, 'code': 404, 'message': err });
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}
async function validatequeryParams(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.query, options);
    if (error) {
        let err = await error.details.map(x => x.message.replaceAll('"', '')).join(', ')
        next({ 'status': false, 'code': 404, 'message': err });
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.query = value;
        next();
    }
}