const db = require('../../../_helpers/db');
const { Sequelize, QueryTypes } = require('sequelize');
const { logs } = require('../../../_middleware');


const { omitHash } = require('../../../_helpers/userHelperFunction');
const getUserById = ({ userModel }, { config }) => async (req, res, next) => {
    // let usermodel = userModel(db.sequelize)
    try {
        const { id } = req.params
        const finduserQuery = `select middlename,firstname,emp_id,lastname,gender,dob,marital_status,temp_add,permanant_add,email_id,mobilenumber,par_mobilenumber,education,degree_date,degrre_cert,experiance_type,experiance_duration,pre_org_name,pre_org_address,pre_org_designation,role from public."EMPLOYEEs" where id =?`;
        const user = await db.sequelize.query(finduserQuery, {
            replacements: [id],
            type: QueryTypes.SELECT,
        });
        if (!user || user.length == 0) throw 'User not found';
        return res.json({ status: true, code: 200, message: "", data: user });
    } catch (error) {
        next(error)
    }
}
const getAllEmployee = ({ userModel }, { config }) => async (req, res, next) => {
    // try {
    //     const users = await db.sequelize.query(`SELECT id ,emp_id,firstname,lastname,email_id,mobilenumber,is_active FROM public."EMPLOYEEs" where role='employee' ORDER BY id DESC`, { type: QueryTypes.SELECT });
    //     if (!users || users.length == 0) throw 'User not found';
    //     return res.json({ status: true, code: 200, message: "", data: users });
    // } catch (error) {
    //     next(error)
    // }
    try {
        const users = await db.sequelize.query(`SELECT emp.id,emp.emp_id,emp.firstname,emp.lastname,emp.email_id,emp.mobilenumber,emp.is_active ,ep.emp_id as is_profile FROM public."EMPLOYEEs"
as emp left join public.employee_profiles as ep on ep.emp_id=emp.emp_id where role ='employee' ORDER BY emp.id DESC`, { type: QueryTypes.SELECT });
        if (!users || users.length == 0) throw 'User not found';
        return res.json({ status: true, code: 200, message: "", data: users });
    } catch (error) {
        next(error)
    }
}
const getEmployeeId = ({ userModel }, { config }) => async (req, res, next) => {
    try {
        const maxId = await db.sequelize.query(`SELECT MAX(emp_number) AS maxId FROM public.max_emp_ids`, { type: QueryTypes.SELECT });
        let newId = ''
        if(maxId[0].maxid<10){
            newId = `PT-00${Number(maxId[0].maxid) + 1}`
        }else if(maxId[0].maxid>=10 && maxId[0].maxid<100){
            newId = `PT-0${Number(maxId[0].maxid) + 1}`
        }else{
            newId = `PT-${Number(maxId[0].maxid) + 1}`
        }
        if (!maxId || maxId.length == 0) throw 'Please try again or contact administration';
        return res.json({ status: true, code: 200, message: "", data: newId });
    } catch (error) {
        next(error)
    }
}
const getProfile = ({ userModel }, { config }) => async (req, res, next) => {
    // let usermodel = userModel(db.sequelize)
    try {
        const { id } = req.user
        const finduserQuery = `SELECT emp.firstname,emp.middlename,emp.lastname,emp.email_id,emp.emp_id,ep.doj,ep.designation,ed.profile_photo FROM public."EMPLOYEEs" as emp INNER JOIN public.employee_profiles as ep ON emp.emp_id = ep.emp_id Inner JOIN public.employee_docs as ed ON emp.emp_id = ed.emp_id where emp.id=?;`;
        const user = await db.sequelize.query(finduserQuery, {
            replacements: [id],
            type: QueryTypes.SELECT,
        });
        if (!user || user.length == 0) throw 'User not found';
        return res.json({ status: true, code: 200, message: "", data: user });
    } catch (error) {
        next(error)
    }
}
const getupdateProfile = ({ userModel }, { config }) => async (req, res, next) => {
    // let usermodel = userModel(db.sequelize)
    try {
        const { id } = req.params
        const finduserQuery = `select emp.emp_id, emp.firstname, emp.middlename, emp.lastname, emp.email_id, emp.gender, ep.designation, ep.doj, ep.salary, ep.increse_sal, ep.date_of_app, ep.designation, ep.prometed_desig from public."EMPLOYEEs" as emp left join public.employee_profiles as ep on ep.emp_id = emp.emp_id where emp.id = ?`;
        const user = await db.sequelize.query(finduserQuery, {
            replacements: [id],
            type: QueryTypes.SELECT,
        });
        if (!user || user.length == 0) throw 'User not found';
        return res.json({ status: true, code: 200, message: "", data: user });
    } catch (error) {
        next(error)
    }
}
const getUserDocs = ({ userModel }, { config }) => async (req, res, next) => {
    // let usermodel = userModel(db.sequelize)
    try {
        const { emp_id } = req.user
        const finduserQuery = `select emp_id,profile_photo,aadhar_number,aadhar_doc,pan_number,pan_doc,resident_doc,education_doc,bank_acc_number,ifsc_code,bank_branch,bank_name,bank_doc,exp_cer_doc,sal_slip_doc from public."employee_docs" where emp_id =?`;
        const user = await db.sequelize.query(finduserQuery, {
            replacements: [emp_id],
            type: QueryTypes.SELECT,
        });
        if (!user || user.length == 0) throw 'User not found';
        return res.json({ status: true, code: 200, message: "", data: user });
    } catch (error) {
        next(error)
    }
}

module.exports = { getUserById, getAllEmployee, getEmployeeId, getProfile, getUserDocs, getupdateProfile }