var url = require('url');
function checkSqlInjection(req, res, next) {
    const pattern = new RegExp(/(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.*)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i)

    return async (req, res, next) => {
        let header = JSON.stringify(req.headers).replaceAll('/', '');
        header = header.replaceAll('*', '')
        if (req.body.apiUrl) {
            req.body.apiUrl = (req.body.apiUrl).replaceAll('/', '$')
        }
        if (pattern.test(JSON.stringify(req.body))) {
            return res.status(500).send({ status: false, code: 500, message: "Something Went Wrong" })
        }
        if (pattern.test(JSON.stringify(req.query))) {
            return res.status(500).send({ status: false, code: 500, message: "Something Went Wrong" })
        }
        if (pattern.test(header)) {
            return res.status(500).send({ status: false, code: 500, message: "Something Went Wrong" })
        }
        next();
    }
}
module.exports = checkSqlInjection 