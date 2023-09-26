const { DataTypes } = require("sequelize");
const holidayScheema = {
  holiday_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: { type: DataTypes.DATE, allowNull: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  color: { type: DataTypes.STRING(20), allowNull: true },
  description: { type: DataTypes.STRING(50), allowNull: true },
  is_active:{type:DataTypes.BOOLEAN,defaultValue:true},
  createdat: { type: DataTypes.DATE, allowNull: true,defaultValue:new Date() },
  updatedat: { type: DataTypes.DATE, allowNull: true,defaultValue:new Date() },


};
module.exports = holidayScheema;