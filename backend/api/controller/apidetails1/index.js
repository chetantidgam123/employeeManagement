
const { registerapi } = require('./post')
const { checkSqlInjection, authorize } = require('../../../_middleware');
const { getApiById, getAllApi } = require('./_get');
module.exports = (apiModel, { config }) => {
    const router = config.express.Router();
    router.post('/registerapi', checkSqlInjection(), authorize(), registerapi(apiModel, { config }));
    router.get('/:id', checkSqlInjection(), authorize(), getApiById(apiModel, { config }));
    router.get('', checkSqlInjection(), authorize(), getAllApi(apiModel, { config }));
    return router;
};