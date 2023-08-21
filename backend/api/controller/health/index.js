const { health } = require('./get')

module.exports = (models, { config }) => {
    const router = config.express.Router();

    router.get('', health(models, { config }));

    return router;
};