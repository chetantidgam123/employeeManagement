const db = require('../../../_helpers/db');

const test = ({ testModel }, { config }) => async (req, res, next) => {
    let apimodel = testModel(db.sequelize)
    const params = req.body
    try {
        await apimodel.create(params);
        return res.json({
            status: true,
            code: 200,
            message: "Tests Registered Successfully!"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    test
};