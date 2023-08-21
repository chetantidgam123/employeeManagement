
function omitHash(user) {
    const { hash, password, ...userWithoutHash } = user;
    return userWithoutHash;
}

module.exports = { omitHash }