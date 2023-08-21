
const { DataTypes } = require('sequelize');
const apiDetailsSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    testName: { type: DataTypes.STRING(50), allowNull: false },
};
module.exports = apiDetailsSchema