
const { test } = require('./post')
const { getAllTestData } = require('./_get');


module.exports = (testModel, { config }) => {
    const router = config.express.Router();
    router.post('/test', test(testModel, { config }));
    router.get('', getAllTestData(testModel, { config }));
    return router;
};