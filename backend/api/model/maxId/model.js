const empId_schema = require('./schema')
module.exports = empIdModel;

function empIdModel(sequelize) {
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
    return sequelize.define('max_emp_id', empId_schema, options);
}