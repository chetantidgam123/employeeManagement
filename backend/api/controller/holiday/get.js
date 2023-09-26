const db = require('../../../_helpers/db');
const { Sequelize, QueryTypes } = require('sequelize');


const getHolidaysList_emp = ({ holidayModel }, { config }) => async (req, res, next) => {
    try {
        const holidays = await db.sequelize.query(`SELECT holiday_id,date,color,title,description,is_active from public.holidays WHERE is_active=true ORDER BY date DESC`, { type: QueryTypes.SELECT });
        if (!holidays || holidays.length == 0){
            return res.json({ status: false, code: 404, message: "No Holidays Updated",});
        };
        return res.json({ status: true, code: 200, message: "", data: holidays });
    } catch (error) {
        next(error)
    }
}

//  ****************     Admin Api     ********* 

const getHolidaysList = ({ holidayModel }, { config }) => async (req, res, next) => {
    try {
        const holidays = await db.sequelize.query(`SELECT holiday_id,date,color,title,description,is_active from public.holidays ORDER BY date DESC`, { type: QueryTypes.SELECT });
        if (!holidays || holidays.length == 0){
            return res.json({ status: false, code: 404, message: "No Holidays Updated",});
        };
        return res.json({ status: true, code: 200, message: "", data: holidays });
    } catch (error) {
        next(error)
    }
}
const getHolidayById = ({ holidayModel }, { config }) => async (req, res, next) => {
            const{id} = req.params
    try {
        const holiday = await db.sequelize.query(`SELECT holiday_id,date,color,title,description from public.holidays WHERE holiday_id=?`, { replacements:[id], type: QueryTypes.SELECT });
        if (!holiday || holiday.length == 0){
            return res.json({ status: false, code: 404, message: "No Holiday Updated",});
        };
        return res.json({ status: true, code: 200, message: "", data: holiday[0] });
    } catch (error) {
        next(error)
    }
}


module.exports = {getHolidaysList,getHolidayById,getHolidaysList_emp}