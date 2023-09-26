const holidayScheema = require('./schema')
module.exports = holidayModel;

function holidayModel(sequelize) {
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
    return sequelize.define('holiday', holidayScheema, options);
}