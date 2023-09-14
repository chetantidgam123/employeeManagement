const db = require('../../../_helpers/db');
const { Sequelize, QueryTypes } = require('sequelize');

const getAllEmployee = ({ userModel }, { config }) => async (req, res, next) => {
    try {
        const users = await db.sequelize.query(`SELECT emp.id,emp.emp_id,emp.firstname,emp.lastname,emp.email_id,emp.mobilenumber,emp.is_active ,ep.emp_id as is_profile FROM public."EMPLOYEEs"
as emp left join public.employee_profiles as ep on ep.emp_id=emp.emp_id where role ='employee' ORDER BY emp.id DESC`, { type: QueryTypes.SELECT });
        if (!users || users.length == 0) throw 'User not found';
        return res.json({ status: true, code: 200, message: "", data: users });
    } catch (error) {
        next(error)
    }
}

module.exports = {}