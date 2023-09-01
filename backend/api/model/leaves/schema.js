const { DataTypes } = require("sequelize");
const leavesScheema = {
  leave_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  emp_id: { type: DataTypes.STRING(20), allowNull: false },
  leave_date: { type: DataTypes.DATE, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  resource: { type: DataTypes.STRING(300), allowNull: true },
  color: { type: DataTypes.STRING(20), allowNull: true },
  status: { type: DataTypes.STRING(20), allowNull: false },
  leave_type: { type: DataTypes.STRING(20), allowNull: false }

};
module.exports = leavesScheema;