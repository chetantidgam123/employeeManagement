const attendanceScheema = require('./schema')
module.exports = attendanceModel;

function attendanceModel(sequelize) {
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
    return sequelize.define('attendance', attendanceScheema, options);
}