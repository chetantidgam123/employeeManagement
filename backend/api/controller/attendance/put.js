const db = require('../../../_helpers/db');
const { omitHash } = require('../../../_helpers/userHelperFunction');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { validateRequest } = require('../../../_middleware');
const { logs } = require('../../../_middleware');


const update = ({ userModel }, { config }) => async (req, res, next) => {
    const params = req.body
    const { id } = req.params
    const usermodel = userModel(db.sequelize)
    try {
        const user = await usermodel.findByPk(id);
        // validate
        const usernameChanged = params.username && user.username !== params.username;
        if (usernameChanged && await usermodel.findOne({ where: { username: params.username } })) {
            throw 'Username "' + params.username + '" is already taken';
        }

        // hash password if it was entered
        if (params.password) {
            params.hash = await bcrypt.hash(params.password, 10);
        }

        // copy params to user and save
        Object.assign(user, params);
        await user.save();
        let responce = {
            status: true,
            code: 200,
            message: "User Update Successfully!",
            data: omitHash(user.get())
        }
        logs(req, responce)
        return res.json({
            status: true,
            code: 200,
            message: "User Update Successfully!",
            data: omitHash(user.get())
        });
    } catch (error) {
        next(error)
    }
}
function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstname: Joi.string().alphanum().trim().min(3).max(30).empty(''),
        lastname: Joi.string().alphanum().trim().min(3).max(30).empty(''),
        mobilenumber: Joi.string().regex(/^\+?[1-9][0-9]{5,12}$/).trim().min(5).max(13).empty('')
    });
    validateRequest(req, next, schema);
}
module.exports = {
    update,
    updateSchema
}