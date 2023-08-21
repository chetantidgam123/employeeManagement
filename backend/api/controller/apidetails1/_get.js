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
const getAllApi = ({ apiDetailsModel }, { config }) => async (req, res, next) => {
    let apimodel = apiDetailsModel(db.sequelize)
    try {
        let api = await apimodel.findAll();
        api = await api.map((ele) => {
            ele.apiUrl = changeurl(ele.apiUrl)
            return ele
        })
        if (!api) throw 'Api not found';
        return res.json({ status: true, code: 200, message: "", data: api });
    } catch (error) {
        next(error)
    }
}

module.exports = { getApiById, getAllApi }