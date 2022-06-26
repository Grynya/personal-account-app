const paymentService = require("../services/payment-service");
const express = require('express');
const router = express.Router();

const auth = require("./auth")

router.get('/:clientId',
    auth,
    async function (req, res) {
    let result = await paymentService.getAvailablePayments(req.params.clientId);
    res.status(result.statusCode).json(result.payments);
});

router.post('/',
    auth,
    async function (req, res) {
    let result = await paymentService.createPayment(req.body);
    res.status(result.statusCode).json(result.payment);
});
module.exports = router;
