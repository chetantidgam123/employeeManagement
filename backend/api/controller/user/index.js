
const { checkSqlInjection, authorize, authorizeAdmin } = require('../../../_middleware')
const { createUser, registerSchema, login, loginSchema, } = require('./post')
const { getUserById, getAllEmployee } = require('./get');
const { update } = require('./put');
const { _delete } = require('./delete');

module.exports = (userModel, { config }) => {
    const router = config.express.Router();
    router.post('/create_account', registerSchema, createUser(userModel, { config }));
    router.post('/login', loginSchema, login(userModel, { config }));
    router.get('/getAllEmployee', authorize(), getAllEmployee(userModel, { config }));
    router.get('/:id', checkSqlInjection(), authorize(), getUserById(userModel, { config }));
    router.put('/:id', checkSqlInjection(), authorize(), update(userModel, { config }));
    router.delete('/:id', checkSqlInjection(), authorizeAdmin(), _delete(userModel, { config }));
    return router;
};