const {body, validationResult} = require("express-validator");
const validateClientRequest = async (req) => {
    await body('name').isLength({max: 100}).run(req);
    await body('phone').exists().optional().isMobilePhone().run(req);
    await body('company').isLength({max: 100}).run(req);
    await body('email').exists().optional().isEmail().run(req);
    return validationResult(req);
}
module.exports = validateClientRequest;
