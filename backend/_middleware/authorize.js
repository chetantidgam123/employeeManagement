const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');
const userModel = require('../api/model/user')
module.exports = authorize;
function authorize() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),
        // attach full user record to request object
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            const user = await userModel(db.sequelize).findByPk(req.user.sub);

            // check user still exists
            if (!user)
                return res.status(401).json({ status: false, code: 401, message: 'Unauthorized' });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}