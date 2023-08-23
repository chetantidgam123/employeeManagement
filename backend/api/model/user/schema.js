const { DataTypes } = require("sequelize");
const userSchem = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  emp_id: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(100), allowNull: false },
  firstname: { type: DataTypes.STRING(50), allowNull: false },
  middlename: { type: DataTypes.STRING(50), allowNull: false },
  lastname: { type: DataTypes.STRING(50), allowNull: false },
  gender: { type: DataTypes.STRING(50), allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: false },
  marital_status: { type: DataTypes.STRING(50), allowNull: false },
  temp_add: { type: DataTypes.STRING(200), allowNull: false },
  permanant_add: { type: DataTypes.STRING(200), allowNull: false },
  email_id: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  mobilenumber: { type: DataTypes.BIGINT,unique: true, allowNull: false },
  par_mobilenumber: { type: DataTypes.BIGINT, allowNull: false },
  education: { type: DataTypes.STRING(50), allowNull: false },
  degree_date: { type: DataTypes.DATEONLY, allowNull: false },
  degrre_cert: { type: DataTypes.STRING(200), allowNull: true },
  experiance_type: { type: DataTypes.STRING(50), allowNull: false },
  experiance_duration: { type: DataTypes.STRING(50), allowNull: true },
  pre_org_name: { type: DataTypes.STRING(100), allowNull: true },
  pre_org_address: { type: DataTypes.STRING(200), allowNull: true },
  pre_org_designation: { type: DataTypes.STRING(100), allowNull: true },
  hash: { type: DataTypes.STRING(100), allowNull: false },
  uuid: { type: DataTypes.STRING(100), allowNull: false },
  role: { type: DataTypes.STRING(10), allowNull: false },
  is_active:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false}
};
module.exports = userSchem;
