const { DataTypes } = require("sequelize");
const uploadDocsSchema = {
  doc_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  emp_id: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  profile_photo: { type: DataTypes.STRING(200), allowNull: true },
  aadhar_number: { type: DataTypes.STRING(200), allowNull: false },
  aadhar_doc: { type: DataTypes.STRING(200), allowNull: true },
  pan_number: { type: DataTypes.STRING(200), allowNull: false },
  pan_doc: { type: DataTypes.STRING(200), allowNull: true },
  resident_doc: { type: DataTypes.STRING(200), allowNull: true },
  bank_doc: { type: DataTypes.STRING(200), allowNull: true },
  bank_acc_number: { type: DataTypes.STRING(200), allowNull: false },
  ifsc_code: { type: DataTypes.STRING(200), allowNull: false },
  bank_branch: { type: DataTypes.STRING(200), allowNull: false },
  bank_name: { type: DataTypes.STRING(200), allowNull: false },
  education_doc: { type: DataTypes.STRING(200), allowNull: true },
  exp_cer_doc: { type: DataTypes.STRING(200), allowNull: true },
  sal_slip_doc: { type: DataTypes.STRING(200), allowNull: true },
};
module.exports = uploadDocsSchema;
