
const { DataTypes } = require('sequelize');
const apiDetailsSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    apiName: { type: DataTypes.STRING(50), allowNull: false },
    apimethod: { type: DataTypes.STRING(20), allowNull: false },
    apiUrl: { type: DataTypes.STRING(200), allowNull: false },
};
module.exports = apiDetailsSchema