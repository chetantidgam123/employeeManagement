
function changeurl(url) {
    let a = url.replaceAll('$', '/')
    return a
}
module.exports = { changeurl }