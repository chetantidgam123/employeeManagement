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
const apply_leave =
  ({ leavesModel }, { config }) =>
    async (req, res, next) => {
      const { start, end, leave_type, color, title, resource, status } = req.body;
      const dateArray = await gateDate(start, end)
      if (dateArray) {
        let leaves_Model = leavesModel(db.sequelize);
        const { emp_id } = req.user
        try {
          const findemailQuery = `select leave_date from public."leaves" where emp_id =? and leave_date in (?) and (status=? or status=?)`;
          const leave = await db.sequelize.query(findemailQuery, {
            replacements: [emp_id, dateArray, 'pending', 'approved'],
            type: QueryTypes.SELECT,
          });
          let alreadyLeve = []
          if (leave && leave.length > 0) {
            alreadyLeve = await leave.map(e => e.leave_date)
            // throw 'you already applied for this leave ' + alreadyLeve.join()
          }
          let bulkData = []
          for (let i = 0; i < dateArray.length; i++) {
            if (alreadyLeve.includes(dateArray[i])) {
              continue;
            }
            let obj = {
              emp_id: emp_id,
              leave_date: dateArray[i],
              title: title,
              resource: resource,
              color: color,
              status: status,
              leave_type: leave_type,
              createdat: new Date(),
              updatedat: new Date()
            }
            bulkData.push(obj)
          }
          const leaves = await leaves_Model.bulkCreate(bulkData)

          return res.json({
            status: true,
            code: 200,
            data: leaves,
            message: "Request sent for leave Successfully!",
            rejected: alreadyLeve.length > 0 ? 'you already applied for this leave ' + alreadyLeve.join() : ''
          })

        } catch (err) {
          next(err);
        }

      } else {
        throw dateArray
      }
    };

function apply_leave_schema(req, res, next) {
  const schema = Joi.object({
    start: Joi.string().trim().required(),
    end: Joi.string().trim().required(),
    leave_type: Joi.string().trim().required(),
    leave_date: Joi.string(),
    color: Joi.string().trim().allow(''),
    title: Joi.string().trim().min(3).max(200).required(),
    resource: Joi.string().max(500).allow(''),
    status: Joi.string().allow(''),
  });
  validateRequest(req, next, schema);
}

const getLeaveByEmpIdAndMonth = ({ leavesModel }, { config }) =>
  async (req, res, next) => {
    const { month } = req.body
    const { emp_id } = req.user
    try {
      const findemailQuery = `SELECT resource,leave_id,emp_id,title,color,status,leave_type,leave_date FROM public.leaves
                              WHERE DATE_TRUNC('month', leave_date) = DATE ? and emp_id =? and status=?`;
      const leaves = await db.sequelize.query(findemailQuery, {
        replacements: [month, emp_id, 'approved'],
        type: QueryTypes.SELECT,
      });
      if (!leaves || leaves.length == 0) {
        throw 'No Leaves'
      }
      return res.json({
        status: true,
        code: 200,
        data: leaves,
        message: "",
      })
    } catch (error) {
      next(error)
    }
  }
function getLeaveByEmpIdAndMonth_schema(req, res, next) {
  const schema = Joi.object({
    month: Joi.string().trim().required(),
  });
  validateRequest(req, next, schema);
}
const getLeavesList = ({ leavesModel }, { config }) =>
  async (req, res, next) => {
    const { emp_id } = req.user
    const { startDate, endDate, status } = req.body
    try {
      const findleaveQuery = `select e.firstname,e.lastname, l.leave_id,l.emp_id,l.title,l.resource,l.leave_type,l.status,l.leave_date,l.createdat as apply_date from public.leaves as l inner join public."EMPLOYEEs" as e on e.emp_id = l.emp_id WHERE l.leave_date BETWEEN ? AND ? and l.emp_id = ?
;`;
      const leaves = await db.sequelize.query(findleaveQuery, {
        replacements: [startDate, endDate, emp_id],
        type: QueryTypes.SELECT,
      });
      if (!leaves || leaves.length == 0) {
        throw 'No Leaves Applied By You'
      }
      return res.json({
        status: true,
        code: 200,
        data: leaves,
        message: "",
      })
    }
    catch (error) {
      next(error)
    }
  }
function getLeavesList_schema(req, res, next) {
  const schema = Joi.object({
    startDate: Joi.string().trim().required(),
    endDate: Joi.string().trim().required(),
  });
  validateRequest(req, next, schema);
}
function gateDate(startDate, endDate) {
  console.log('DATES', startDate, endDate);
  try {
    var dates = [];
    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) <= 0) {
      dates.push(moment(currDate.clone().toDate()).format('YYYY-MM-DD'));
    }
    dates.unshift(startDate)
    return dates;
  } catch (error) {
    console.log(error);
    return false
  }
}

// ****************  Admin Apis  ******************* 
const getEmpWhoAplLeave = ({ leavesModel }, { config }) =>
  async (req, res, next) => {
    const { start_date, end_date, emp_id, status } = req.body
    try {
      if (emp_id && emp_id != '' && status && status != '') {
        const findleaveQuery = `select distinct e.firstname, e.lastname, l.emp_id
      from public.leaves as l inner join public."EMPLOYEEs" as e on e.emp_id = l.emp_id
       WHERE l.leave_date BETWEEN ? AND ? and l.emp_id=? and l.status=?;`;
        const leaves = await db.sequelize.query(findleaveQuery, {
          replacements: [start_date, end_date, emp_id, status],
          type: QueryTypes.SELECT,
        });
        if (!leaves || leaves.length == 0) {
          throw 'No Leaves Applied Employee'
        }
        return res.json({
          status: true,
          code: 200,
          data: leaves,
          message: "",
        })
      }
      if ((emp_id && emp_id != '') && (!status || status == '')) {
        let findleaveQuery1 = `select distinct e.firstname, e.lastname, l.emp_id
      from public.leaves as l inner join public."EMPLOYEEs" as e on e.emp_id = l.emp_id
       WHERE l.leave_date BETWEEN ? AND ? and l.emp_id=?`;
        const leaves1 = await db.sequelize.query(findleaveQuery1, {
          replacements: [start_date, end_date, emp_id],
          type: QueryTypes.SELECT,
        });
        if (!leaves1 || leaves1.length == 0) {
          throw 'No Leaves Applied Employee'
        }
        return res.json({
          status: true,
          code: 200,
          data: leaves1,
          message: "",
        })
      }
      if ((status && status != '') && (!emp_id || emp_id == '')) {
        let findleaveQuery1 = `select distinct e.firstname, e.lastname, l.emp_id
      from public.leaves as l inner join public."EMPLOYEEs" as e on e.emp_id = l.emp_id
       WHERE l.leave_date BETWEEN ? AND ? and l.status=?`;
        const leaves2 = await db.sequelize.query(findleaveQuery1, {
          replacements: [start_date, end_date, status],
          type: QueryTypes.SELECT,
        });
        if (!leaves2 || leaves2.length == 0) {
          throw 'No Leaves Applied By Anyone'
        }
        return res.json({
          status: true,
          code: 200,
          data: leaves2,
          message: "",
        })
      }
      if ((!status || status == '') && (!emp_id || emp_id == '')) {
        let findleaveQuery1 = `select distinct e.firstname, e.lastname, l.emp_id
      from public.leaves as l inner join public."EMPLOYEEs" as e on e.emp_id = l.emp_id
       WHERE l.leave_date BETWEEN ? AND ?`;
        const leaves3 = await db.sequelize.query(findleaveQuery1, {
          replacements: [start_date, end_date],
          type: QueryTypes.SELECT,
        });
        if (!leaves3 || leaves3.length == 0) {
          throw 'No Leaves Applied By Anyone'
        }
        return res.json({
          status: true,
          code: 200,
          data: leaves3,
          message: "",
        })
      }
    }
    catch (error) {
      next(error)
    }
  }
function getEmpWhoAplLeave_schema(req, res, next) {
  const schema = Joi.object({
    start_date: Joi.string().trim().allow(''),
    end_date: Joi.string().trim().allow(''),
    emp_id: Joi.string().trim().allow(''),
    status: Joi.string().trim().allow(''),
  });
  validateRequest(req, next, schema);
}
const getEmpLeaveDateRange = ({ leavesModel }, { config }) =>
  async (req, res, next) => {
    const { start_date, end_date, emp_id, status } = req.body
    try {
      const findleaveQuery = `select e.firstname,e.lastname, l.leave_id,l.emp_id,l.title,l.resource,l.leave_type,l.status,l.leave_date,l.createdat as apply_date from public.leaves as l inner join public."EMPLOYEEs" as e on e.emp_id = l.emp_id WHERE l.leave_date BETWEEN ? AND ? and l.emp_id = ?
;`;
      const leaves = await db.sequelize.query(findleaveQuery, {
        replacements: [start_date, end_date, emp_id],
        type: QueryTypes.SELECT,
      });
      if (!leaves || leaves.length == 0) {
        throw 'No Leaves Applied By Employee'
      }
      return res.json({
        status: true,
        code: 200,
        data: leaves,
        message: "",
      })
    }
    catch (error) {
      next(error)
    }
  }
function getEmpLeaveDateRange_schema(req, res, next) {
  const schema = Joi.object({
    start_date: Joi.string().trim().allow(''),
    end_date: Joi.string().trim().allow(''),
    emp_id: Joi.string().trim().allow(''),
    status: Joi.string().trim().allow(''),
  });
  validateRequest(req, next, schema);
}
const updateEmpLeave = ({ leavesModel }, { config }) =>
  async (req, res, next) => {
    const { status, reject_remark, leave_id } = req.body
    try {
      const updateleaveQuery = `UPDATE public."leaves" SET status=?,reject_remark=?,updatedat=? where leave_id=? `;
      const leaves = await db.sequelize.query(updateleaveQuery, {
        replacements: [status, reject_remark, new Date(), leave_id],
        type: QueryTypes.UPDATE,
      });
      if (!leaves || leaves.length == 0) {
        throw 'No Leaves Found'
      }
      return res.json({
        status: true,
        code: 200,
        data: leaves,
        message: "Leaves Updated Successfully",
      })
    }
    catch (error) {
      next(error)
    }
  }
function updateEmpLeave_schema(req, res, next) {
  const schema = Joi.object({
    leave_id: Joi.number().required(),
    status: Joi.string().trim().required(),
    reject_remark: Joi.string().trim().max(50).required()
  });
  validateRequest(req, next, schema);
}
module.exports = {
  apply_leave,
  apply_leave_schema,
  getLeaveByEmpIdAndMonth,
  getLeaveByEmpIdAndMonth_schema,
  getEmpWhoAplLeave,
  getEmpWhoAplLeave_schema,
  getEmpLeaveDateRange,
  getEmpLeaveDateRange_schema,
  updateEmpLeave,
  updateEmpLeave_schema,
  getLeavesList,
  getLeavesList_schema
};
