const reportService = require("../services/report-service");
const express = require('express');
const router = express.Router();

const auth = require("./auth")

router.get('/:paidFrom/:paidUntil', auth,
    async function (req, res) {
        let result = await reportService.createReport(req.params.paidFrom, req.params.paidUntil);
        res.status(result.statusCode).json(result.report);
    });
module.exports = router;
