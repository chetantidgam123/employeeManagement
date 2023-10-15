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
        const insertIdQuery = `insert into public.max_emp_ids (emp_id,emp_number) VALUES (?,?) RETURNING "emp_id"`;
        const [maxId] = await db.sequelize.query(insertIdQuery, {
          replacements: [params.emp_id, params.emp_id.split("-")[1]],
          type: QueryTypes.INSERT,
        });
        console.log([maxId]);
        return res.json({
          status: true,
          code: 200,
          message: "User Registered Successfully!",
        });
      } catch (err) {
        console.log(err);
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
    experiance_Duration: Joi.string().trim().min(1).max(3).allow(''),
    pre_org_name: Joi.string().trim().min(3).max(50).allow(''),
    pre_org_address: Joi.string().trim().min(3).max(200).allow(''),
    pre_org_designation: Joi.string().trim().min(3).max(50).allow(''),
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
  ({ upload_docsModel }, { config }) =>
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
          params.profile_photo =
            req.files["profile_photo"] && req.files["profile_photo"].length > 0
              ? req.files["profile_photo"][0].filename
              : "";
          params.aadhar_doc =
            req.files["aadhar_doc"] && req.files["aadhar_doc"].length > 0
              ? req.files["aadhar_doc"][0].filename
              : "";
          params.pan_doc =
            req.files["pan_doc"] && req.files["pan_doc"].length > 0
              ? req.files["pan_doc"][0].filename
              : "";
          params.resident_doc =
            req.files["resident_doc"] && req.files["resident_doc"].length > 0
              ? req.files["resident_doc"][0].filename
              : "";
          params.bank_doc =
            req.files["bank_doc"] && req.files["bank_doc"].length > 0
              ? req.files["bank_doc"][0].filename
              : "";
          params.education_doc =
            req.files["education_doc"] && req.files["education_doc"].length > 0
              ? req.files["education_doc"][0].filename
              : "";
          params.exp_cer_doc =
            req.files["exp_cer_doc"] && req.files["exp_cer_doc"].length > 0
              ? req.files["exp_cer_doc"][0].filename
              : "";
          params.sal_slip_doc =
            req.files["sal_slip_doc"] && req.files["sal_slip_doc"].length > 0
              ? req.files["sal_slip_doc"][0].filename
              : "";

          const insert_docQuery = `INSERT INTO public."employee_docs"(emp_id,profile_photo,aadhar_number,aadhar_doc,pan_number,pan_doc,resident_doc,education_doc,bank_acc_number,ifsc_code,bank_branch,bank_name,bank_doc,exp_cer_doc,sal_slip_doc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING "emp_id"`;
          const [rowOut] = await db.sequelize.query(insert_docQuery, {
            replacements: [
              params.emp_id,
              params.profile_photo,
              params.aadhar_number,
              params.aadhar_doc,
              params.pan_number,
              params.pan_doc,
              params.resident_doc,
              params.education_doc,
              params.bank_acc_number,
              params.ifsc_code,
              params.bank_branch,
              params.bank_name,
              params.bank_doc,
              params.exp_cer_doc,
              params.sal_slip_doc,
            ],
            type: QueryTypes.INSERT,
          });
          return res.json({
            status: true,
            code: 200,
            message: "_documents Uploaded Successfully!",
          });
        } else {
          params.profile_photo =
            req.files["profile_photo"] && req.files["profile_photo"].length > 0
              ? req.files["profile_photo"][0].filename
              : users.profile_photo ? users.profile_photo : "";
          params.aadhar_doc =
            req.files["aadhar_doc"] && req.files["aadhar_doc"].length > 0
              ? req.files["aadhar_doc"][0].filename
              : users.aadhar_doc ? users.aadhar_doc : "";
          params.pan_doc =
            req.files["pan_doc"] && req.files["pan_doc"].length > 0
              ? req.files["pan_doc"][0].filename
              : users.pan_doc ? users.pan_doc : "";
          params.resident_doc =
            req.files["resident_doc"] && req.files["resident_doc"].length > 0
              ? req.files["resident_doc"][0].filename
              : users.resident_doc ? users.resident_doc : "";
          params.bank_doc =
            req.files["bank_doc"] && req.files["bank_doc"].length > 0
              ? req.files["bank_doc"][0].filename
              : users.bank_doc ? users.bank_doc : "";
          params.education_doc =
            req.files["education_doc"] && req.files["education_doc"].length > 0
              ? req.files["education_doc"][0].filename
              : users.education_doc ? users.education_doc : "";
          params.exp_cer_doc =
            req.files["exp_cer_doc"] && req.files["exp_cer_doc"].length > 0
              ? req.files["exp_cer_doc"][0].filename
              : users.exp_cer_doc ? users.exp_cer_doc : "";
          params.sal_slip_doc =
            req.files["sal_slip_doc"] && req.files["sal_slip_doc"].length > 0
              ? req.files["sal_slip_doc"][0].filename
              : users.sal_slip_doc ? users.sal_slip_doc : "";

          const update_docQuery = `UPDATE public."employee_docs" SET profile_photo=?,aadhar_number=?,aadhar_doc=?,pan_number=?,pan_doc=?,resident_doc=?,education_doc=?,bank_acc_number=?,ifsc_code=?,bank_branch=?,bank_name=?,bank_doc=?,exp_cer_doc=?,sal_slip_doc=?, updatedat=? WHERE emp_id=?`;
          const [rowOut] = await db.sequelize.query(update_docQuery, {
            replacements: [
              params.profile_photo,
              params.aadhar_number,
              params.aadhar_doc,
              params.pan_number,
              params.pan_doc,
              params.resident_doc,
              params.education_doc,
              params.bank_acc_number,
              params.ifsc_code,
              params.bank_branch,
              params.bank_name,
              params.bank_doc,
              params.exp_cer_doc,
              params.sal_slip_doc,
              new Date(),
              req.user.emp_id
            ],
            type: QueryTypes.UPDATE,
          });
          return res.json({
            status: true,
            code: 200,
            message: "_documents Updated Successfully!",
          });
        }
      } catch (err) {
        console.log(err);
        next(err);
      }
    };

function uploadUserDocSchema(req, res, next) {
  const docsschema = Joi.object({
    profile_photo: Joi.string().trim().min(3).max(50),
    aadhar_number: Joi.string().trim().min(3).max(50).required(),
    aadhar_doc: Joi.string().trim().min(3).max(50),
    pan_number: Joi.string().trim().min(3).max(50).required(),
    pan_doc: Joi.string().trim().min(3).max(50),
    resident_doc: Joi.string().trim().min(3).max(50),
    education_doc: Joi.string().trim().min(3).max(50),
    bank_acc_number: Joi.string().trim().min(3).max(50).required(),
    ifsc_code: Joi.string().trim().min(3).max(50).required(),
    bank_branch: Joi.string().trim().min(3).max(50).required(),
    bank_name: Joi.string().trim().min(3).max(50).required(),
    bank_doc: Joi.string().trim().min(3).max(50),
    exp_cer_doc: Joi.string().trim().min(3).max(50),
    sal_slip_doc: Joi.string().trim().min(3).max(50),
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
          if(rowOut.length>0){
            const updateQuery = `UPDATE public."EMPLOYEEs" SET is_active =? WHERE emp_id=?`;
            const [rowOut] = await db.sequelize.query(updateQuery, {
              replacements: [true,params.emp_id],
              type: QueryTypes.UPDATE,
            });
            return res.json({
              status: true,
              code: 200,
              message: "Employee Details Updated Successfully!",
            });
          }else{
            return res.json({
              status: false,
              code: 200,
              message: "Employee Details not updated!",
            });

          }
        } else {
          const updateQuery = `UPDATE public."employee_docs" SET doj,salary=?,increse_sal=?,date_of_app=?,designation=?,prometed_desig=? WHERE emp_id = ?`;
          const [rowOut] = await db.sequelize.query(updateQuery, {
            replacements: [
              params.doj,
              params.salary,
              params.increse_sal,
              params.date_of_app,
              params.designation,
              params.prometed_desig,
              params.emp_id
            ],
            type: QueryTypes.UPDATE,
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
