const leavesScheema = require('./schema')
module.exports = leavesModel;

function leavesModel(sequelize) {
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
    return sequelize.define('leave', leavesScheema, options);
}