const db = require('../../../_helpers/db');
const { Sequelize, QueryTypes } = require('sequelize');
const { logs } = require('../../../_middleware');


const { omitHash } = require('../../../_helpers/userHelperFunction');
const getUserById = ({ userModel }, { config }) => async (req, res, next) => {
    let usermodel = userModel(db.sequelize)
    try {
        const { id } = req.params
        const user = await usermodel.findByPk(id);
        if (!user) throw 'User not found';
        let responce = { status: true, code: 200, message: "", data: { ...omitHash(user.get()) } }
        logs(req, responce)
        return res.json({ status: true, code: 200, message: "", data: { ...omitHash(user.get()) } });
    } catch (error) {
        next(error)
    }
}
const getAllEmployee = ({ userModel }, { config }) => async (req, res, next) => {
    try {
         const users = await db.sequelize.query(`SELECT emp_id,firstname,lastname,email_id,mobilenumber FROM public."TBL_USERs" where role='user'`, { type: QueryTypes.SELECT });
        if (!users || users.length==0 ) throw 'User not found';
        return res.json({ status: true, code: 200, message: "", data: users });
    } catch (error) {
        next(error)
    }
}

module.exports = { getUserById,getAllEmployee }