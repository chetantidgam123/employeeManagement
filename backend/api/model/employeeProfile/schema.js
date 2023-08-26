const { DataTypes } = require("sequelize");
const employeeProfileSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  emp_id: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  doj: { type: DataTypes.STRING(200), allowNull: false },
  salary: { type: DataTypes.STRING(200), allowNull: false },
  increse_sal: { type: DataTypes.STRING(200), allowNull: false },
  date_of_app: { type: DataTypes.STRING(200), allowNull: false },
  designation: { type: DataTypes.STRING(200), allowNull: false },
  prometed_desig: { type: DataTypes.STRING(200), allowNull: false },
};
module.exports = employeeProfileSchema;