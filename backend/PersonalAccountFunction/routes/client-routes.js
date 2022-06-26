const clientService = require("../services/client-service");
const express = require('express');
const router = express.Router();

const auth = require("./auth")

// router.get('/',
//     auth,
//     async function (req, res) {
//     let result = await clientService.getAllClients();
//     res.status(result.statusCode).json(result.clients);
// });
// router.get('/:clientId',
//     auth,
//     async function (req, res) {
//     let result = await clientService.getClientById(req.params.clientId);
//     res.status(result.statusCode).json(result.client);
// });
router.put('/add/registrarId/:clientId/:registrarId', auth, async function (req, res) {
    let result = await clientService.grantPermissionsToClient(req.params.clientId, req.params.registrarId);
    res.status(result.statusCode).json(result.client);
});
router.put('/:clientId',
   auth,
    async function (req, res) {
    let result = await clientService.updateClient(req.params.clientId, req.body);
    res.status(result.statusCode).json(result.client);
})
router.delete('/:clientId',
    auth,
    async function (req, res) {
    let result = await clientService.deleteClient(req.params.clientId);
    res.status(result.statusCode).json(result.deleted);
})
module.exports = router;
