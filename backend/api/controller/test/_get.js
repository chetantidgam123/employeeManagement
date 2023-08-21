const { changeurl } = require('../../../_helpers/apiDetailsHelper');
const db = require('../../../_helpers/db');



const getApiById = ({ apiDetailsModel }, { config }) => async (req, res, next) => {
    let apimodel = apiDetailsModel(db.sequelize)
    try {
        const { id } = req.params
        const api = await apimodel.findByPk(id);
        api.apiUrl = changeurl(api.apiUrl)
        if (!api) throw 'Api not found';
        return res.json({ status: true, code: 200, message: "", data: api });
    } catch (error) {
        next(error)
    }
}
const getAllTestData = ({ testModel }, { config }) => async (req, res, next) => {
    let apimodel = testModel(db.sequelize)
    try {
        let api = await apimodel.findAll();
        if (!api) throw 'Api not found';
        return res.json({ status: true, code: 200, message: "", data: api });
    } catch (error) {
        next(error)
    }
}

module.exports = { getApiById, getAllTestData }