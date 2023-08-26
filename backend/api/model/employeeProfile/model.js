const employeeProfileSchema = require('./schema')
module.exports = employeeProfileModel;

function employeeProfileModel(sequelize) {
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
    return sequelize.define('employee_profile', employeeProfileSchema, options);
}