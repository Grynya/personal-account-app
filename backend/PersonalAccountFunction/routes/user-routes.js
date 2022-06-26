const userService = require("../services/user-service");
const express = require('express');
const router = express.Router();
const {validateUserFullRequest, validateUserRequestWithEmail} = require('./validation/validate-user');

const auth = require("./auth")
const validateClientRequest = require("./validation/validate-client");
const mailer = require("../config/mailer.config");
const {userPartnerApiKeysModel} = require("../models/userPartnerApiKeys");
const generateApiKey = require('generate-api-key');

router.get('/', auth,
    async function (req, res) {
        const result = await userService.getAllUsers();
        res.status(result.statusCode).json(result.users);
    });

router.get('/clients/:userId',
    auth,
    async function (req, res) {
        const result = await userService.getAllClients(req.params.userId);
        res.status(result.statusCode).json(result.clients);
    });
router.get('/clients/deleted/:userId',
    auth,
    async function (req, res) {
        const result = await userService.getAllDeletedClients(req.params.userId);
        res.status(result.statusCode).json(result.clients);
    });
router.post('/local', async (req, res) => {
    const errors = await validateUserRequestWithEmail(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    let result = await userService.createUserPartner(req.body);
    if (result.statusCode === 200) {
        await mailer.sendConfirmationRegistrationEmail(req.body, result.generatedId);
        res.status(result.statusCode).json("Пользователь успешно зарегистрирован! Пожалуйста, проверьте почту");
    } else res.status(result.statusCode).json(result.generatedId);
});

router.put('/local/full', async (req, res, next) => {
    const errors = await validateUserFullRequest(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    let response = await userService.completeUserPartner(req.body);
    res.status(response.statusCode).json(response.user);
});

router.post('/headerapikey', async (req, res) => {
    const errors = await validateUserFullRequest(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    let generatedKey = generateApiKey();
    await userPartnerApiKeysModel.create({key: generatedKey, email: req.body.email})
    let result = await userService.createUserPartner(req.body);
    if (result.statusCode === 200) {
        await mailer.sendConfirmationRegistrationEmailWithApiKey(req.body, result.generatedId, generatedKey);
        res.status(result.statusCode).json("Пользователь успешно зарегистрирован! Пожалуйста, проверьте почту");
    } else res.status(result.statusCode).json(result.generatedId);
});


router.post('/add/user', auth, async (req, res) => {
    const errors = await validateUserFullRequest(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    let result = await userService.createUser(req.body);
    if (result.statusCode === 200) {
        await mailer.sendConfirmationRegistrationEmail(req.body, result.userCredentials.id);
        res.status(result.statusCode).json("Пользователь успешно зарегистрирован! Пожалуйста, проверьте почту");
    } else res.status(result.statusCode).json(result.userCredentials);
});
router.put('/add/registrar/:userId/:registrarId', auth, async function (req, res) {
    let result = await userService.addRegistrar(req.params.userId, req.params.registrarId);
    res.status(result.statusCode).json(result.user);
});
router.put('/add/client/:userId',
    auth,
    async function (req, res) {
    const errors = await validateClientRequest(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    console.log(req.params.userId)
    let result = await userService.addClient(req.params.userId, req.body);
    res.status(result.statusCode).json(result.user);
});

router.delete('/:userId', auth, async function (req, res) {
    let result = await userService.deleteUser(req.params.userId);
    res.status(result.statusCode);
});
module.exports = router;
