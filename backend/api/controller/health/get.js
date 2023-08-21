
const { initialize } = require('../../../_helpers/db');
const { logs } = require('../../../_middleware');

const health = ({ }, { logger }) => (req, res, next) => {
    initialize()
        .then((result) => {
            let responce = { Status: "Connected" }
            logs(req, responce)
            res.send({ Status: "Connected" })
        })
        .catch((err) => { next(err) })
};

module.exports = {
    health,
};
