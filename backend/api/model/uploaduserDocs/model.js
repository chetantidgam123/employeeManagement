const uploadDocsSchema = require('./schema')
module.exports = uploadDocsModel;

function uploadDocsModel(sequelize) {
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
    return sequelize.define('employee_doc', uploadDocsSchema, options);
}