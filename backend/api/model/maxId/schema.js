
const { DataTypes } = require('sequelize');
const empId_schema = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    emp_id: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    emp_number: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    
  };
module.exports = empId_schema