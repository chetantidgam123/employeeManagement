const db = require('../../../_helpers/db');
const { Sequelize, QueryTypes } = require('sequelize');
const moment = require("moment/moment");
const getTotalLeavesData = ({ leavesModel }, { config }) =>
  async (req, res, next) => {
    const { emp_id } = req.user
    try {
      const findDojQuery = `select doj from public."employee_profiles" WHERE emp_id = ?;`;
      const _doj = await db.sequelize.query(findDojQuery, {
        replacements: [emp_id],
        type: QueryTypes.SELECT,
      });
      if (!_doj || _doj.length == 0) {
        return res.json({
          status: false,
          code: 200,
          data: [],
          message: "No data found",
        })
      }

      let result = {
        total_leaves: '',
        applied_leaves: '',
        pending_leaves: ''
      }
      var startDate = moment(_doj[0].doj);
      if(Number(_doj[0].doj.split('-')[0])<2023){
        startDate = moment('2023-01-01')
      }
      var endDate = moment();
      var betweenMonths = [];
      var noOfMonths = 0;
      const findMonthlyLeave = `select month,year,applied_leaves from public.attendances where emp_id = ?;`;
      const app_leaves = await db.sequelize.query(findMonthlyLeave, {
        replacements: [emp_id],
        type: QueryTypes.SELECT,
      });
      let all_app_leaves = 0
      if (app_leaves && app_leaves.length > 0) {
        all_app_leaves = app_leaves.reduce((acc, e) => {
          return acc + Number(e.applied_leaves)
        }, 0)
      }
      if (startDate < endDate) {
        var date = startDate.startOf('month');
        while (date < endDate.endOf('month')) {
          betweenMonths.push(date.format('YYYY-MM'));
          date.add(1, 'month');
        }
      }
      if(moment(startDate).date()>15){
        noOfMonths = betweenMonths.length-1;
      }else{
        noOfMonths = betweenMonths.length;
      }
      result.total_leaves = noOfMonths * 1.5;
      result.applied_leaves = all_app_leaves;
      result.pending_leaves = (noOfMonths * 1.5) - Number(all_app_leaves);
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

module.exports = { getTotalLeavesData }