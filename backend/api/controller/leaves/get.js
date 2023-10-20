const db = require('../../../_helpers/db');
const { Sequelize, QueryTypes } = require('sequelize');
const moment = require("moment/moment");
const getTotalLeavesData = ({ leavesModel }, { config }) =>
  async (req, res, next) => {
    const { emp_id } = req.user
    try {
      const findleaveQuery = `select doj from public."employee_profiles" WHERE emp_id = ?;`;
      const leaves = await db.sequelize.query(findleaveQuery, {
        replacements: [emp_id],
        type: QueryTypes.SELECT,
      });
      if (!leaves || leaves.length == 0) {
        return res.json({
          status: false,
          code: 200,
          data: [],
          message: "No data found",
        })
      }
      let result = {
        total_leaves:'',
        applied_leaves:'',
        pending_leaves:''
    }
    let doj = moment(leaves[0].doj).month()
    let curr = moment().month()
    result.total_leaves = (curr-doj)*1.5
      return res.json({
        status: true,
        code: 200,
        data: result,
        message: "",
      })
    }
    catch (error) {
      next(error)
    }
  }

module.exports = {getTotalLeavesData}