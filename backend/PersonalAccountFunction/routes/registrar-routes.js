const express = require('express');
const router = express.Router();
const registrarService = require("../services/registrar-service")
const auth = require("./auth")
router.get('/is-blocked/:registrarId/:clientId',
    auth,
    async function (req, res) {
        let result =
            await registrarService
                .isBlocked(req.params.registrarId, req.params.clientId);
        res.status(result.statusCode).json(result.isBlocked);
    });
router.post('/block',
    auth,
    async function (req, res) {
        let result =
            await registrarService
            .blockRegistrar(req.body.registrarId, req.body.clientId, req.body.message);
        res.status(result.statusCode).json(result.blocked);
    });
router.delete('/unblock/:registrarId/:clientId', auth,
    async function (req, res) {
        let result =
            await registrarService
                .unblockRegistrar(req.params.registrarId, req.params.clientId);
        res.status(result.statusCode).json(result.blocked);
    });
module.exports = router;
