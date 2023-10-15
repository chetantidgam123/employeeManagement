const db = require('../../../_helpers/db');
const { QueryTypes } = require("sequelize");

const _delete = ({ leavesModel }, { config }) => async (req, res, next) => {
    const _leavesModel = leavesModel(db.sequelize)
    try {
            const { emp_id } = req.user
            const {id} = req.params
            const findemailQuery = `DELETE FROM public."leaves" where emp_id =? and leave_id =? and status=? RETURNING leave_id`;
            const leave = await db.sequelize.query(findemailQuery, {
              replacements: [emp_id,id, 'pending',],
              type: QueryTypes.DELETE
            });
            return res.json({ status: true, code: 200, data: {}, message: 'Leave deleted successfully' });
        } catch (error) {
        next(error)
    }
}
module.exports = { _delete }