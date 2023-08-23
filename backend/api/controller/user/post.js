const db = require("../../../_helpers/db");
const { omitHash } = require("../../../_helpers/userHelperFunction");
const configFile = require("../../../config.json");
const {
  validateRequest,
  validatequeryParams,
} = require("_middleware/validate-request");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { logs } = require("../../../_middleware");
const { json, QueryTypes } = require("sequelize");
const { emp_id } = require("../../model/user/schema");

const createUser1 =
  ({ userModel }, { config }) =>
  async (req, res, next) => {
    let usermodel = userModel(db.sequelize);
    const params = req.body;
    try {
      if (await usermodel.findOne({ where: { email_id: params.email_id } })) {
        throw "Email Id " + params.email_id + " is already Registerd";
      }
      if (await usermodel.findOne({ where: { mobilenumber: params.mobilenumber } })) {
        throw "Mobile Number " + params.mobilenumber + " is already Registerd";
      }
      if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
      }
      params.uuid = uuidv4();
       if(req.files["degrre_cert"]){
          params.degrre_cert = req.files["degrre_cert"][0].filename;
        }else{
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
      if(req.files["degrre_cert"]){
          params.degrre_cert = req.files["degrre_cert"][0].filename;
        }else{
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
      const insertIdQuery = `insert into public.max_emp_id (emp_id,emp_number) VALUES (?,?) RETURNING "emp_id"` 
      const [maxId] = await db.sequelize.query(insertIdQuery, {
        replacements: [
          params.emp_id,
          params.emp_id.split('-')[1]
        ],
        type:QueryTypes.INSERT
      })
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
    mobilenumber: Joi.string() .regex(/^\+?[1-9][0-9]{5,12}$/).trim().min(5).max(13).required(),
    par_mobilenumber: Joi.string() .regex(/^\+?[1-9][0-9]{5,12}$/).trim().min(5).max(13),
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
    experiance_Duration: Joi.string().trim().min(1) .max(3),
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

module.exports = {
  createUser,
  registerSchema,
  login,
  loginSchema,
};
