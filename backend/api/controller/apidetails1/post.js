const db = require('../../../_helpers/db');

const registerapi = ({ apiDetailsModel }, { config }) => async (req, res, next) => {
    let apimodel = apiDetailsModel(db.sequelize)
    const params = req.body
    try {
        await apimodel.create(params);
        return res.json({
            status: true,
            code: 200,
            message: "Api Registered Successfully!"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerapi
};