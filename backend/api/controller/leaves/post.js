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

const apply_leave =
  ({ leavesModel }, { config }) =>
    async (req, res, next) => {
      let leaves_Model = leavesModel(db.sequelize);
      const { startDate, endDate, leave_type, color, title, resource, status } = req.body;
      const { emp_id } = req.user
      const dateArray = gateDate(startDate, endDate)
      if (dateArray) {
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
              leave_type: leave_type
            }
            bulkData.push(obj)
          }
          const leaves = await leaves_Model.bulkCreate(bulkData)

          return res.json({
            status: true,
            code: 200,
            data: leaves,
            message: "Request sent for leave Successfully!",
            rejected: 'you already applied for this leave ' + alreadyLeve.join()
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
    emp_id: Joi.string().trim().min(3).max(50).required(),
    startDate: Joi.string().trim().required(),
    endDate: Joi.string().trim().required(),
    leave_type: Joi.string().trim().required(),
    color: Joi.string().trim().allow(''),
    title: Joi.string().trim().min(3).max(200).required(),
    resource: Joi.string().max(500).allow(''),
    status: Joi.string(),
  });
  validateRequest(req, next, schema);
}

const getLeaveByEmpIdAndMonth = ({ leavesModel }, { config }) =>
  async (req, res, next) => {

  }

function gateDate(startDate, endDate) {
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
module.exports = {
  apply_leave,
  apply_leave_schema,
  gateDate
};
