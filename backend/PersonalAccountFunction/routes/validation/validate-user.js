const {body, validationResult} = require("express-validator");
module.exports.validateUserRequestWithEmail = async (req) => {
    await body('email').isEmail().run(req);
    await body('password').isLength({min: 5, max: 100}).run(req);
    return validationResult(req);
}
module.exports.validateUserFullRequest = async (req) => {
    await body('companyName')
        .isLength({min: 3, max: 50})
        .run(req);
    await body('phone').matches("/\\(?([0-9]{3})\\)?([ .-]?)([0-9]{3})\\2([0-9]{4})/\n");
    //todo: validation of inn
    return validationResult(req);
}
