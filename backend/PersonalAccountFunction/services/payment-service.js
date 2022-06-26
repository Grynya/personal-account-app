'use strict';
const {paymentsModel} = require('../models/payment');
const {clientsModel} = require("../models/client");
const {registrarInfoModel} = require("../models/registrarInfo");
const {blockersModel} = require("../models/blockers");
module.exports.createPayment = async (payment) => {
    try {
        let blocked = await blockersModel.get({clientId: payment.clientId, registrarId: payment.registrarId});
        if (blocked) return {"payment": "Is blocked. Blocked message: " + blocked.message, "statusCode": 200}
        else if (await registrarInfoModel.get(payment.registrarId)) {
            if (await clientsModel.get(payment.clientId)) {
                return {
                    "payment": await paymentsModel.create({
                        registrarId: payment.registrarId,
                        clientId: payment.clientId,
                        paidFrom: payment.paidFrom,
                        duration: payment.duration,
                        paidUntil: setPaidFromDate(payment.duration, payment.paidFrom)
                    }), "statusCode": 200
                };
            } else return {"payment": "Invalid clientId", "statusCode": 400};
        } else return {"payment": "Invalid registrarId", "statusCode": 400};
    } catch (error) {
        console.log(error);
        return {
            "payment": "Payment with such registrarId and paidUntil already exists",
            "statusCode": error.statusCode || 500
        }
    }
}

/**
 * Function counts paidFrom date depend on duration
 * @returns {string}
 * @param duration - expected to be 1 month or 1 year
 * @param paidFrom - start date of period
 */
function setPaidFromDate(duration, paidFrom) {
    let paidFromDate = new Date(paidFrom);
    if (duration === "1 month") {
        paidFromDate.setMonth(paidFromDate.getMonth() + 2);
    } else {
        paidFromDate.setMonth(paidFromDate.getMonth() + 1);
        paidFromDate.setFullYear(paidFromDate.getFullYear() + 1);
    }
    if (paidFromDate.getMonth().toString().length===1)
        return paidFromDate.getFullYear()+"-0"+paidFromDate.getMonth()+"-"+paidFromDate.getDate();
    return paidFromDate.getFullYear()+"-"+paidFromDate.getMonth()+"-"+paidFromDate.getDate();
}

/**
 * Function returns payments that are available to user by clientId
 * if the array of registrarIds is empty, return all payments by clientId,
 * if the array of registrarIds is not empty, returns payments by registrarIds from field registrarIds in client
 * @param clientId
 * @returns {Promise<{payments: string, statusCode: number}|{payments: *[], statusCode: number}>}
 */
module.exports.getAvailablePayments = async (clientId) => {
    try {
        let res;
        let client = await clientsModel.get(clientId);
        if (client !== undefined) {
            let {registrarIds} = JSON.parse(JSON.stringify(client));
            if (registrarIds.length === 0) {
                res = await this.getPaymentsByClientId(clientId);
                console.log(res)
            } else {
                for (let id of registrarIds) {
                    res = [];
                    res.push({
                        "registrarId": id,
                        "payments": await this.getPaymentByRegistrarId(id)
                    })
                }
            }
            return {"payments": res, "statusCode": 200}
        } else return {"payments": "Invalid clientId", "statusCode": 400}
    } catch (error) {
        console.log(error);
        return {"payments": "Invalid clientId", "statusCode": error.statusCode || 500}
    }
}
/**
 * @returns {Promise<{payments: string, statusCode: number}|{payments: *[], statusCode: number}>} payments by registrarIds
 * @param id id of registrar id
 */
module.exports.getPaymentByRegistrarId = async (id) => {
    return await paymentsModel
        .scan({
            registrarId: {eq: id},
            isDeleted: {eq: false}
        })
        .exec();
}
/**
 * @returns {Promise<{}>} payments by clientId
 * @param id id of client
 */
module.exports.getPaymentsByClientId = async (id) => {
    let paymentsOfClient = await paymentsModel
        .scan({
            clientId: {eq: id},
            isDeleted: {eq: false},
        })

        .exec();

    return paymentsOfClient.reduce((prevPayment, payment) => {
        prevPayment[payment.registrarId] = prevPayment[payment.registrarId] || [];
        prevPayment[payment.registrarId].push(payment);
        return prevPayment;
    }, {})
}

module.exports.deletePayment = async (registrarId, paidUntil) => {
    try {
        return {
            "deleted": await paymentsModel.update(
                {registrarId: registrarId, paidUntil: paidUntil},
                {
                    $SET:
                        {isDeleted: true}
                }), "statusCode": 200
        };
    } catch (error) {
        console.log(error)
        return {"deleted": "", "statusCode": error.statusCode || 500}
    }
};
