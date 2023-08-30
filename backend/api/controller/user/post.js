const db = require("../../../_helpers/db");
const { omitHash } = require("../../../_helpers/userHelperFunction");
const configFile = require("../../../config.json");
const { validateRequest } = require("_middleware/validate-request");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const user = require(".");

const createUser1 =
  ({ userModel }, { config }) =>
    async (req, res, next) => {
      let usermodel = userModel(db.sequelize);
      const params = req.body;
      try {
        if (await usermodel.findOne({ where: { email_id: params.email_id } })) {
          throw "Email Id " + params.email_id + " is already Registerd";
        }
        if (
          await usermodel.findOne({
            where: { mobilenumber: params.mobilenumber },
          })
        ) {
          throw "Mobile Number " + params.mobilenumber + " is already Registerd";
        }
        if (params.password) {
          params.hash = await bcrypt.hash(params.password, 10);
        }
        params.uuid = uuidv4();
        if (req.files["degrre_cert"]) {
          params.degrre_cert = req.files["degrre_cert"][0].filename;
        } else {
          params.degrre_cert = null;
        }
        // save user
        await usermodel.create(params);
        return res.json({
          status: true,
          code: 200,
          message: "User Registered Successfully!",
        });
      } catch (err) {
        next(err);
      }
    };
const createUser =
  ({ userModel }, { config }) =>
    async (req, res, next) => {
      const params = req.body;
      try {
        const findemailQuery = `select email_id from public."EMPLOYEEs" where email_id =?`;
        const email = await db.sequelize.query(findemailQuery, {
          replacements: [params.email_id],
          type: QueryTypes.SELECT,
        });
        if (email && email.length > 0) {
          throw "Email Id " + params.email_id + " is already Registered";
        }
        const findmobileQuery = `select mobilenumber from public."EMPLOYEEs" where mobilenumber =?`;
        const mobile = await db.sequelize.query(findmobileQuery, {
          replacements: [params.mobilenumber],
          type: QueryTypes.SELECT,
        });
        if (mobile && mobile.length > 0) {
          throw "Mobile Number " + params.mobilenumber + " is already Registered";
        }
        if (params.password) {
          params.hash = await bcrypt.hash(params.password, 10);
        }
        params.uuid = uuidv4();
        if (req.files["degrre_cert"]) {
          params.degrre_cert = req.files["degrre_cert"][0].filename;
        } else {
          params.degrre_cert = null;
        }
        const insertempQuery = `INSERT INTO public."EMPLOYEEs"(middlename,firstname,emp_id,password,lastname,gender,dob,marital_status,temp_add,permanant_add,email_id,mobilenumber,par_mobilenumber,education,degree_date,degrre_cert,experiance_type,experiance_duration,pre_org_name,pre_org_address,pre_org_designation,hash,uuid,role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
            RETURNING "emp_id"`;
        const [rowOut] = await db.sequelize.query(insertempQuery, {
          replacements: [
            params.middlename,
            params.firstname,
            params.emp_id,
            params.password,
            params.lastname,
            params.gender,
            params.dob,
            params.marital_status,
            params.temp_add,
            params.permanant_add,
            params.email_id,
            params.mobilenumber,
            params.par_mobilenumber,
            params.education,
            params.degree_date,
            params.degrre_cert,
            params.experiance_type,
            params.experiance_Duration,
            params.pre_org_name,
            params.pre_org_address,
            params.pre_org_designation,
            params.hash,
            params.uuid,
            params.role,
          ],
          type: QueryTypes.INSERT,
        });
        const insertIdQuery = `insert into public.max_emp_id (emp_id,emp_number) VALUES (?,?) RETURNING "emp_id"`;
        const [maxId] = await db.sequelize.query(insertIdQuery, {
          replacements: [params.emp_id, params.emp_id.split("-")[1]],
          type: QueryTypes.INSERT,
        });
        return res.json({
          status: true,
          code: 200,
          message: "User Registered Successfully!",
        });
      } catch (err) {
        next(err);
      }
    };

function registerSchema(req, res, next) {
  req.body.role = "employee";
  const schema = Joi.object({
    firstname: Joi.string().alphanum().trim().min(3).max(30).required(),
    middlename: Joi.string().alphanum().trim().min(3).max(30).required(),
    lastname: Joi.string().alphanum().trim().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    mobilenumber: Joi.string()
      .regex(/^\+?[1-9][0-9]{5,12}$/)
      .trim()
      .min(5)
      .max(13)
      .required(),
    par_mobilenumber: Joi.string()
      .regex(/^\+?[1-9][0-9]{5,12}$/)
      .trim()
      .min(5)
      .max(13),
    email_id: Joi.string().trim().email().required(),
    role: Joi.string(),
    emp_id: Joi.string().trim().min(3).max(20).required(),
    gender: Joi.string().trim().min(3).max(20).required(),
    dob: Joi.string().trim().min(3).max(50).required(),
    marital_status: Joi.string().trim().min(3).max(30).required(),
    temp_add: Joi.string().trim().min(3).max(200).required(),
    permanant_add: Joi.string().trim().min(3).max(200).required(),
    education: Joi.string().trim().min(3).max(30).required(),
    degree_date: Joi.string().trim().min(3).max(50).required(),
    experiance_type: Joi.string().trim().min(3).max(50).required(),
    experiance_Duration: Joi.string().trim().min(1).max(3),
    pre_org_name: Joi.string().trim().min(3).max(50),
    pre_org_address: Joi.string().trim().min(3).max(200),
    pre_org_designation: Joi.string().trim().min(3).max(50),
  });
  validateRequest(req, next, schema);
}
const login =
  ({ userModel }, { config }) =>
    async (req, res, next) => {
      let usermodel = userModel(db.sequelize);
      const { email_id, password } = req.body;
      try {
        const user = await usermodel
          .scope("withHash")
          .findOne({ where: { email_id: email_id } });
        if (!user) throw "User Not found";
        if (!(await bcrypt.compare(password, user.hash)))
          throw "Incorrect Password";
        // authentication successful
        const token = jwt.sign(
          { sub: user.id, role: user.role },
          configFile.secret,
          { expiresIn: "1d" }
        );
        // let responce = { status: true, message: "User Login Successfully!", code: 200, data: { ...omitHash(user.get()) }, token }
        // logs(req, responce)
        return res.json({
          status: true,
          message: "User Login Successfully!",
          code: 200,
          data: { ...omitHash(user.get()) },
          token,
        });
      } catch (error) {
        next(error);
      }
    };

function loginSchema(req, res, next) {
  const schema = Joi.object({
    email_id: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}
const uploadUserDoc =
  ({ uploadDocsModel }, { config }) =>
    async (req, res, next) => {
      const params = req.body;
      try {
        const users = await db.sequelize.query(
          `SELECT emp_id FROM public."employee_docs" where emp_id=?`,
          {
            replacements: [
              req.user.emp_id
            ], type: QueryTypes.SELECT,
          }
        );
        if (!users || users.length == 0) {
          params.emp_id = req.user.emp_id;
          params.profilePhoto =
            req.files["profilePhoto"] && req.files["profilePhoto"].length > 0
              ? req.files["profilePhoto"][0].filename
              : "";
          params.aadharDoc =
            req.files["aadharDoc"] && req.files["aadharDoc"].length > 0
              ? req.files["aadharDoc"][0].filename
              : "";
          params.panDoc =
            req.files["panDoc"] && req.files["panDoc"].length > 0
              ? req.files["panDoc"][0].filename
              : "";
          params.residentDoc =
            req.files["residentDoc"] && req.files["residentDoc"].length > 0
              ? req.files["residentDoc"][0].filename
              : "";
          params.bankDoc =
            req.files["bankDoc"] && req.files["bankDoc"].length > 0
              ? req.files["bankDoc"][0].filename
              : "";
          params.educationDoc =
            req.files["educationDoc"] && req.files["educationDoc"].length > 0
              ? req.files["educationDoc"][0].filename
              : "";
          params.expCerDoc =
            req.files["expCerDoc"] && req.files["expCerDoc"].length > 0
              ? req.files["expCerDoc"][0].filename
              : "";
          params.salSlipDoc =
            req.files["salSlipDoc"] && req.files["salSlipDoc"].length > 0
              ? req.files["salSlipDoc"][0].filename
              : "";

          const insertDocQuery = `INSERT INTO public."employee_docs"(emp_id,profile_photo,aadhar_number,aadhar_doc,pan_number,pan_doc,resident_doc,education_doc,bank_acc_number,ifsc_code,bank_branch,bank_name,bank_doc,exp_cer_doc,sal_slip_doc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING "emp_id"`;
          const [rowOut] = await db.sequelize.query(insertDocQuery, {
            replacements: [
              params.emp_id,
              params.profilePhoto,
              params.aadharNumber,
              params.aadharDoc,
              params.panNumber,
              params.panDoc,
              params.residentDoc,
              params.educationDoc,
              params.bankAccNumber,
              params.ifscCode,
              params.bankBranch,
              params.bankName,
              params.bankDoc,
              params.expCerDoc,
              params.salSlipDoc,
            ],
            type: QueryTypes.INSERT,
          });
          return res.json({
            status: true,
            code: 200,
            message: "Documents Uploaded Successfully!",
          });
        } else {
          params.profilePhoto =
            req.files["profilePhoto"] && req.files["profilePhoto"].length > 0
              ? req.files["profilePhoto"][0].filename
              : users.profilePhoto ? users.profilePhoto : "";
          params.aadharDoc =
            req.files["aadharDoc"] && req.files["aadharDoc"].length > 0
              ? req.files["aadharDoc"][0].filename
              : users.aadharDoc ? users.aadharDoc : "";
          params.panDoc =
            req.files["panDoc"] && req.files["panDoc"].length > 0
              ? req.files["panDoc"][0].filename
              : users.panDoc ? users.panDoc : "";
          params.residentDoc =
            req.files["residentDoc"] && req.files["residentDoc"].length > 0
              ? req.files["residentDoc"][0].filename
              : users.residentDoc ? users.residentDoc : "";
          params.bankDoc =
            req.files["bankDoc"] && req.files["bankDoc"].length > 0
              ? req.files["bankDoc"][0].filename
              : users.bankDoc ? users.bankDoc : "";
          params.educationDoc =
            req.files["educationDoc"] && req.files["educationDoc"].length > 0
              ? req.files["educationDoc"][0].filename
              : users.educationDoc ? users.educationDoc : "";
          params.expCerDoc =
            req.files["expCerDoc"] && req.files["expCerDoc"].length > 0
              ? req.files["expCerDoc"][0].filename
              : users.expCerDoc ? users.expCerDoc : "";
          params.salSlipDoc =
            req.files["salSlipDoc"] && req.files["salSlipDoc"].length > 0
              ? req.files["salSlipDoc"][0].filename
              : users.salSlipDoc ? users.salSlipDoc : "";

          const updateDocQuery = `UPDATE public."employee_docs" SET profile_photo=?,aadhar_number=?,aadhar_doc=?,pan_number=?,pan_doc=?,resident_doc=?,education_doc=?,bank_acc_number=?,ifsc_code=?,bank_branch=?,bank_name=?,bank_doc=?,exp_cer_doc=?,sal_slip_doc=?, updatedat=? WHERE emp_id=?`;
          const [rowOut] = await db.sequelize.query(updateDocQuery, {
            replacements: [
              params.profilePhoto,
              params.aadharNumber,
              params.aadharDoc,
              params.panNumber,
              params.panDoc,
              params.residentDoc,
              params.educationDoc,
              params.bankAccNumber,
              params.ifscCode,
              params.bankBranch,
              params.bankName,
              params.bankDoc,
              params.expCerDoc,
              params.salSlipDoc,
              new Date(),
              req.user.emp_id
            ],
            type: QueryTypes.UPDATE,
          });
          return res.json({
            status: true,
            code: 200,
            message: "Documents Updated Successfully!",
          });
        }
      } catch (err) {
        console.log(err);
        next(err);
      }
    };

function uploadUserDocSchema(req, res, next) {
  const docsschema = Joi.object({
    profilePhoto: Joi.string().trim().min(3).max(50),
    aadharNumber: Joi.string().trim().min(3).max(50).required(),
    aadharDoc: Joi.string().trim().min(3).max(50),
    panNumber: Joi.string().trim().min(3).max(50).required(),
    panDoc: Joi.string().trim().min(3).max(50),
    residentDoc: Joi.string().trim().min(3).max(50),
    educationDoc: Joi.string().trim().min(3).max(50),
    bankAccNumber: Joi.string().trim().min(3).max(50).required(),
    ifscCode: Joi.string().trim().min(3).max(50).required(),
    bankBranch: Joi.string().trim().min(3).max(50).required(),
    bankName: Joi.string().trim().min(3).max(50).required(),
    bankDoc: Joi.string().trim().min(3).max(50),
    expCerDoc: Joi.string().trim().min(3).max(50),
    salSlipDoc: Joi.string().trim().min(3).max(50),
  });
  validateRequest(req, next, docsschema);
}
const updateProfileEmployee =
  ({ userModel }, { config }) =>
    async (req, res, next) => {
      const params = req.body;
      try {
        const findemp = `select emp_id from public."employee_profiles" where emp_id =?`;
        const employee = await db.sequelize.query(findemp, {
          replacements: [params.emp_id],
          type: QueryTypes.SELECT,
        });
        if (!employee || employee.length == 0) {
          const insertempQuery = `INSERT INTO public."employee_profiles"(emp_id,doj,salary,increse_sal,date_of_app,designation,prometed_desig) VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING "emp_id"`;
          const [rowOut] = await db.sequelize.query(insertempQuery, {
            replacements: [
              params.emp_id,
              params.doj,
              params.salary,
              params.increse_sal,
              params.date_of_app,
              params.designation,
              params.prometed_desig,
            ],
            type: QueryTypes.INSERT,
          });
          return res.json({
            status: true,
            code: 200,
            message: "Employee Details Updated Successfully!",
          });
        } else {
          const updateQuery = `UPDATE public."employee_docs" SET doj,salary=?,increse_sal=?,date_of_app=?,designation=?,prometed_desig=?`;
          const [rowOut] = await db.sequelize.query(updateQuery, {
            replacements: [
              params.doj,
              params.salary,
              params.increse_sal,
              params.date_of_app,
              params.designation,
              params.prometed_desig,
            ],
            type: QueryTypes.INSERT,
          });
          return res.json({
            status: true,
            code: 200,
            message: "Employee Details Updated Successfully!",
          });
        }
      } catch (err) {
        next(err);
      }
    };

function updateProfileEmployeeSchema(req, res, next) {
  const schema = Joi.object({
    emp_id: Joi.string().trim().min(3).max(30).required(),
    doj: Joi.string().trim().max(50).required(),
    salary: Joi.string().trim().min(4).max(10).required(),
    increse_sal: Joi.string().trim().min(4).max(10).required(),
    date_of_app: Joi.string().trim().max(50),
    designation: Joi.string().trim().min(4).max(200).required(),
    prometed_desig: Joi.string().trim().min(4).max(200),
  });
  validateRequest(req, next, schema);
}
module.exports = {
  createUser,
  registerSchema,
  login,
  loginSchema,
  uploadUserDoc,
  uploadUserDocSchema,
  updateProfileEmployee,
  updateProfileEmployeeSchema
};
