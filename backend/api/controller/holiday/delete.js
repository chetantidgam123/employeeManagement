const db = require('../../../_helpers/db');
const { logs } = require('../../../_middleware');


const _delete = ({ userModel }, { config }) => async (req, res, next) => {
    const usermodel = userModel(db.sequelize)
    try {
        if (req.user.role == 'admin') {
            const user = await usermodel.findByPk(req.params.id);
            if (!user) throw { message: "User Not Found" }
            await user.destroy();
            let responce = { status: true, code: 200, data: {}, message: 'User deleted successfully' }
            logs(req, responce)
            return res.json({ status: true, code: 200, data: {}, message: 'User deleted successfully' });
        } else {
            throw { message: "unauthorized" }
        }

    } catch (error) {
        next(error)
    }
}
module.exports = { _delete }