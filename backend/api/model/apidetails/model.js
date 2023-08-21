const apiDetailsSchema = require('./schema')
module.exports = apiDetailsModel;

function apiDetailsModel(sequelize) {
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
    return sequelize.define('TBL_APIDT', apiDetailsSchema, options);
}