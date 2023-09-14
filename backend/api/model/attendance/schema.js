const { DataTypes } = require("sequelize");
const attendanceScheema = {
  attendance_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  emp_id: { type: DataTypes.STRING(20), allowNull: false },
  month: { type: DataTypes.STRING(5), allowNull: false },
  year: { type: DataTypes.STRING(5), allowNull: false },
  month_data: { type: DataTypes.STRING, allowNull: true },
  createdat: { type: DataTypes.DATE, allowNull: true,defaultValue:new Date() },
  updatedat: { type: DataTypes.DATE, allowNull: true,defaultValue:new Date() },


};
module.exports = attendanceScheema;