const db = require('../../../_helpers/db');
const { omitHash } = require('../../../_helpers/userHelperFunction');
const configFile = require('../../../config.json');
const { validateRequest, validatequeryParams } = require('_middleware/validate-request');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { logs } = require('../../../_middleware');

const createUser = ({ userModel }, { config }) => async (req, res, next) => {
    let usermodel = userModel(db.sequelize)
    const params = req.body
    try {
        if (await usermodel.findOne({ where: { email_id: params.email_id } })) {
            throw 'Email Id ' + params.email_id + ' is already taken';
        }

        // hash password
        if (params.password) {
            params.hash = await bcrypt.hash(params.password, 10);
        }

        //create UUID
        params.uuid = uuidv4();

        // save user
        await usermodel.create(params);
        // let responce = { status: true, code: 200, message: "User Registered Successfully!" }
        // logs(req, responce)
        return res.json({
            status: true,
            code: 200,
            message: "User Registered Successfully!"
        });
    } catch (err) {
        next(err);
    }
};
function registerSchema(req, res, next) {
    req.body.role = 'user'
    const schema = Joi.object({
        firstname: Joi.string().alphanum().trim().min(3).max(30).required(),
        lastname: Joi.string().alphanum().trim().min(3).max(30).required(),
        password: Joi.string().min(6).required(),
        mobilenumber: Joi.string().regex(/^\+?[1-9][0-9]{5,12}$/).trim().min(5).max(13).required(),
        email_id: Joi.string().trim().email().required(),
        role: Joi.string()
    });
    validateRequest(req, next, schema);
}
const login = ({ userModel }, { config }) => async (req, res, next) => {
    let usermodel = userModel(db.sequelize)
    const { email_id, password } = req.body
    try {
        const user = await usermodel.scope('withHash').findOne({ where: { email_id: email_id } });
        if (!user) throw 'User Not found';
        if (!(await bcrypt.compare(password, user.hash))) throw "Incorrect Password"
        // authentication successful
        const token = jwt.sign({ sub: user.emp_id, role: user.role }, configFile.secret, { expiresIn: '1d' });
        // let responce = { status: true, message: "User Login Successfully!", code: 200, data: { ...omitHash(user.get()) }, token }
        // logs(req, responce)
        return res.json({ status: true, message: "User Login Successfully!", code: 200, data: { ...omitHash(user.get()) }, token });
    } catch (error) {
        next(error);
    }
}


function loginSchema(req, res, next) {
    const schema = Joi.object({
        email_id: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

module.exports = {
    createUser,
    registerSchema,
    login,
    loginSchema
};