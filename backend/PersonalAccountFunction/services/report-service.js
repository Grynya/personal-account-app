const clientService = require("./client-service");
const paymentService = require("./payment-service");
/**
 * Function create report with list of all clients and number of payments by its client
 * @returns {Promise<{generatedId: string, statusCode: number}|{generatedId: *, statusCode: number}>}
 */
module.exports.createReport = async (paidFrom, paidUntil) => {
    try {
        let clients = await clientService.getAllClients();
        let resClients = JSON.parse(JSON.stringify(clients));
        let res = [];
        for (let client of resClients.clients) {
            let {id} = JSON.parse(JSON.stringify(client));
            client.payments = filterPayments(await paymentService.getPaymentsByClientId(id), paidFrom, paidUntil);
            res.push(client);
        }
        return {"report": res, "statusCode": 200}
    } catch (error) {
        console.log(error);
        return {"report": "", "statusCode": error.statusCode || 500}
    }
};
const filterPayments = (payments, expectedPaidFrom, expectedPaidUntil) => {
    {
        if (expectedPaidFrom && expectedPaidUntil) {
            return payments.filter(payment => {
                let {paidFrom, paidUntil} = JSON.parse(JSON.stringify(payment));
                return new Date(paidFrom) >= new Date(expectedPaidFrom) && new Date(paidUntil) <= new Date(expectedPaidUntil);
            });
    }
        else return payments;
    }
}
