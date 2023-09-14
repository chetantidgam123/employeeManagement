const tedious = require('tedious');
const { Sequelize, DataTypes } = require('sequelize');

const { dbName, dbConfig } = require('config.json');

module.exports = db = { initialize };

initialize();
async function initialize() {
    const dialect = 'postgres';
    const host = dbConfig.server;
    const { userName, password } = dbConfig.authentication.options;

    // connect to db
    console.log('dbName', dbName);
    const sequelize = new Sequelize(dbName, userName, password, { host, dialect });
    db.sequelize = sequelize;
    try {
        await sequelize.authenticate()
        console.log('connected')
        // return ('connected')
    } catch (error) {
        console.error('failed')
        // return ('failed')
    }
    // init models and add them to the exported db object
    // db.User = require('../api/model/user')(sequelize);
    // db.Docs = require('../api/model/uploaduserDocs')(sequelize);
    // db.profile = require('../api/model/employeeProfile')(sequelize);
    // db.leaves = require('../api/model/leaves')(sequelize);
    // db.attendance = require('../api/model/attendance')(sequelize);
    // db.max_emp_id = require('../api/model/maxId')(sequelize);

    // sync all models with database
    // await sequelize.sync({ alter: true });

}