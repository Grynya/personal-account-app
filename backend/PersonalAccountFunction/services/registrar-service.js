const {registrarInfoModel} = require("../models/registrarInfo");
const {blockersModel} = require("../models/blockers")
const {clientsModel} = require("../models/client");

module.exports.isBlocked = async (registrarId, clientId) => {
    try {
        let res = await blockersModel.get({
            clientId: clientId,
            registrarId: registrarId,
        })
        if (res) return {"isBlocked": true, "statusCode": 200}
        else return {"isBlocked": false, "statusCode": 200};
    } catch
        (error) {
        console.log(error);
        return {"isBlocked": "", "statusCode": error.statusCode || 500}
    }
}
/**
 *
 * @returns {Promise<{blocked: string, statusCode: number}|{payments: string, statusCode: number}|{blocked: AnyDocument, statusCode: number}>}
 * @param registrarId id of registrar to block
 * @param clientId
 * @param blockedMessage blockedMessage that will be given to the client when trying to work at this checkout
 */
module.exports.blockRegistrar = async (registrarId, clientId, blockedMessage) => {
    try {
        const result = await isCorrectBlockedData(clientId, registrarId);
        if (result.isCorrect) {
            return {
                "blocked": await blockersModel.create({
                    clientId: clientId,
                    registrarId: registrarId,
                    message: blockedMessage
                }), statusCode: 200
            }
        } else return result.blockedResponse;
    } catch
        (error) {
        console.log(error);
        return {"blocked": "", "statusCode": error.statusCode || 500}
    }
}
const isCorrectBlockedData = async (clientId, registrarId) => {
    if (await clientsModel.get(clientId)) {
        let registrar = await registrarInfoModel.get(registrarId);
        if (registrar) {
            return {isCorrect: true, blockedResponse: undefined}
        } else return {isCorrect: false, blockedResponse: {"blocked": "Invalid registrarId", "statusCode": 400}}
    } else return {isCorrect: false, blockedResponse: {"blocked": "Invalid clientId", "statusCode": 400}}
}

module.exports.unblockRegistrar = async (registrarId, clientId) => {
    try {
        if (await blockersModel.get({clientId: clientId, registrarId: registrarId})!==undefined) {
            return {
                "blocked": await blockersModel
                    .delete({clientId: clientId, registrarId: registrarId}), "statusCode": 200
            }
        } else return {"blocked": "Is not blocked", "statusCode": 400};
    } catch
        (error) {
        console.log(error);
        return {"blocked": "", "statusCode": error.statusCode || 500}
    }
}
