const { ceatelogs } = require("../_helpers/mongodb")
async function logs(req, res) {
    // console.log(req);
    let obj = {}
    obj.requestBody = req.body
    obj.responceBody = res
    obj.method = req.method
    obj.url = `http//${req.headers.host}${req.originalUrl}`
    ceatelogs(obj)
}
module.exports = logs