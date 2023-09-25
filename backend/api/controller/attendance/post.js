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
const moment = require("moment/moment");

// *******************  Employee Apis ****************
const punchIn =
  ({ attendanceModel }, { config }) =>
  async (req, res, next) => {
    const { month, year, day } = req.body;
    const { emp_id } = req.user;
    var monthData = [];
    try {
      const findMonthOfEmp = `select attendance_id, month,year,emp_id,month_data from public."attendances" where emp_id =? and month=? and year=?`;
      const attendance = await db.sequelize.query(findMonthOfEmp, {
        replacements: [emp_id, month.toString(), year.toString()],
        type: QueryTypes.SELECT,
      });
      if (attendance && attendance.length > 0) {;
        let month_data = JSON.parse(attendance[0].month_data)
        monthData = await month_data.map((ele)=>{
          if(day==ele.day){
            if(ele.punch_in!='P'){
              var beginningTime = moment('10:45am', 'h:mma');
              var currTime = new Date().getTime()
              if(beginningTime.isBefore(currTime)){
                //late punch
                ele.late_punch = 1
              }else{
                
              }
              ele.punch_in = 'P';
            }else{
              return res.json({
                status: false,
                code: 200,
                data: [],
                message: "Already Punch For Today",
              });
            }
          }else if(day>ele.day && ele.punch_in=='-'){
              ele.punch_in='A'
          }
          return ele
        })
        const updateAtteQuery = `UPDATE public."attendances" SET month_data=?,updatedat=? where attendance_id=? `;
        const [,updateatt] = await db.sequelize.query(updateAtteQuery, {
          replacements: [JSON.stringify(monthData), new Date(), attendance[0].attendance_id],
          type: QueryTypes.UPDATE,
        });
        if(updateatt > 0){
          const findMonthOfEmp = `select attendance_id, month,year,emp_id,month_data from public."attendances" where attendance_id = ?`;
          const row1 = await db.sequelize.query(findMonthOfEmp, {
            replacements: [attendance[0].attendance_id],
            type: QueryTypes.SELECT,
          });
          if (row1  && row1[0].attendance_id > 0) {
            return res.json({
              status: true,
              code: 200,
              data: row1[0],
              message: "PunchIn Succefully",
            });
          }else{
            return res.json({
              status: false,
              code: 404,
              data: [],
              message: "",
            });
          }
        }else{

        }
      } 
      else {
        let days = moment(year + "-" + month, "YYYY-MM").daysInMonth();
        if (days > 0) {
          for (let i = 0; i < days; i++) {
            let obj = 
            {
              day: (i + 1) < 10 ? "0" + (i + 1) : (i + 1),
              punch_in: 'A',
              late_punch: 0,
            };
            
            if(day>(i + 1)){
              obj.punch_in = 'A';
            }else if(day==(i + 1)){
              obj.punch_in = 'P';
            }else{
               obj.punch_in = '-'
            }
            console.log('**********',moment(year+'-'+month+'-'+(i+1)).day());
            if(moment(year+'-'+month+'-'+i+1).day()===0){
              obj.punch_in='S'
            }
            monthData.push(obj);
          }
        }
        const _query2 = `insert into public.attendances (emp_id,month,year,month_data) VALUES (?,?,?,?) RETURNING "attendance_id"`;
        const _replacements2 = [emp_id, month, year, JSON.stringify(monthData)];
            const [rowOut] = await db.sequelize.query(_query2, { replacements: _replacements2, type: QueryTypes.INSERT });
            const attendance_id = (rowOut && rowOut.length > 0 && rowOut[0] ? rowOut[0].attendance_id : 0);

       const findMonthOfEmp = `select attendance_id,emp_id,month,year,month_data from public."attendances" where attendance_id = ?`;
          const row1 = await db.sequelize.query(findMonthOfEmp, {
            replacements: [attendance_id],
            type: QueryTypes.SELECT,
          });
          if (row1  && row1[0].attendance_id > 0) {
            return res.json({
              status: true,
              code: 200,
              data: row1[0],
              message: "PunchIn Succefully",
            });
          }else{
            return res.json({
              status: false,
              code: 404,
              data: [],
              message: "",
            });
          }
      }

    } catch (err) {
      next(err);
    }
  };

const getAttByMonthYear =
  ({ attendanceModel }, { config }) =>
  async (req, res, next) => {
    const { emp_id } = req.user;
    const { month, year } = req.body;
    try {
      const findMonthOfEmp = `select attendance_id, month,year,emp_id,month_data from public."attendances" where emp_id =? and month=? and year=?`;
      const attendance = await db.sequelize.query(findMonthOfEmp, {
        replacements: [emp_id, month.toString(), year.toString()],
        type: QueryTypes.SELECT,
      });
      let start_date = moment().startOf('month').format('YYYY-MM-DD')
      let end_date = moment().endOf('month').format('YYYY-MM-DD')
      const findleaveEmp = `select * from public.leaves WHERE leave_date BETWEEN ? AND ? and emp_id=? and status=? `;
      const leave = await db.sequelize.query(findleaveEmp, {
        replacements: [start_date,end_date,emp_id, 'approved'],
        type: QueryTypes.SELECT,
      });
      if (attendance && attendance.length > 0) {
        // if(leave && leave.length>0){
        //   let leaveDay = leave.map((e)=>{
        //     return moment(e.leave_date).day()
        //   })
        // }
        return res.json({
          status: true,
          code: 200,
          data: attendance[0],
          leaves:leave,
          message: "",
        });
      }else{
        return res.json({
          status: false,
          code: 200,
          data: "",
          message: "No data Found",
        });
      }
    } catch (error) {
      next(error);
    }
  };


// ****************  Admin Apis  *******************

module.exports = {
  punchIn,
  getAttByMonthYear,
};
