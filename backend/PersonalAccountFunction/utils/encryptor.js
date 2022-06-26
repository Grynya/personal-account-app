const bcrypt = require("bcrypt");

module.exports.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
}

module.exports.validPassword = async function (password, user) {
    return await bcrypt.compare(password, user.password)
}
