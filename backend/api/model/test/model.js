const apiDetailsSchema = require('./schema')
module.exports = testModel;

function testModel(sequelize) {
    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };
    return sequelize.define('TBL_TEST', apiDetailsSchema, options);
}