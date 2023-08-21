
const { DataTypes } = require('sequelize');
const userSchem = {
    emp_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: { type: DataTypes.STRING(50), allowNull: false },
    lastname: { type: DataTypes.STRING(50), allowNull: false },
    email_id: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(100), allowNull: false },
    hash: { type: DataTypes.STRING(100), allowNull: false },
    mobilenumber: { type: DataTypes.BIGINT, allowNull: false },
    uuid: { type: DataTypes.STRING(100), allowNull: false },
    role: { type: DataTypes.STRING(10), allowNull: false }

};
module.exports = userSchem