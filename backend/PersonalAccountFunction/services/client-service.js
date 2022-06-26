'use strict';

const uuid = require('uuid');
const {clientsModel} = require('../models/client');

module.exports.createClient = async (userId, client) => {
    try {
        let {name, company, phone, email, comment} = JSON.parse(JSON.stringify(client));
        let generatedId = uuid.v4();
        comment ? await clientsModel
            .create({
                id: generatedId,
                partnerId: userId,
                name,
                company,
                phone,
                email,
                comment
            }) : await clientsModel
            .create({
                id: generatedId,
                partnerId: userId,
                name,
                company,
                phone,
                email
            });

        return {"generatedId": generatedId, "statusCode": 200}
    } catch (error) {
        console.log(error);
        return {"generatedId": "", "statusCode": error.statusCode || 500}
    }
};

module.exports.getAllClients = async () => {
    try {
        let clients = await clientsModel.scan().where("isDeleted").eq(false).exec();
        let moreClients = await clientsModel
            .scan()
            .where("isDeleted")
            .eq(false)
            .startAt(clients.lastKey)
            .exec();
        return {"clients": moreClients, "statusCode": 200};
    } catch (error) {
        return {"clients": "", "statusCode": error.statusCode || 500};
    }
};
module.exports.getClientById = async (clientId) => {
    try {
        return {"client": clientsModel.get(clientId), "statusCode": 200}
    } catch (error) {
        return {"clients": "", "statusCode": error.statusCode || 500};
    }
};
module.exports.updateClient = async (id, newClientData) => {
    try {

        return  {"client": await clientsModel.update({id}, newClientData), "statusCode": 200}
    } catch (error) {
        return error.statusCode || 500;
    }
};

module.exports.deleteClient = async (id) => {
    try {
        return {
            "deleted": await clientsModel.update(
                {id: id},
                {
                    $SET:
                        {isDeleted: true}
                }), "statusCode": 200
        };
    } catch (error) {
        console.log(error)
        return {"deleted": "Invalid clientId", "statusCode": error.statusCode || 500}
    }
};
/**
 * Function grants permission to client on registrar by its number by adding registrarId in field
 * registrarIds (array with registrars ids)
 * @param clientId id of the client to which you want to grand permission
 * @param registrarId number of the registrar to which you grant permission
 * @returns {Promise<{payment: *, statusCode: number}|{payment: string, statusCode: number}>} the object with updated
 * client with registrar id and status code
 */
module.exports.grantPermissionsToClient = async (clientId, registrarId) => {
    try {
        let res = await clientsModel.update(
            {id: clientId},
            {
                $ADD:
                    {registrarIds: [registrarId]}
            }
        );
        return {"client": res, "statusCode": 200}
    } catch (error) {
        console.log(error);
        return {"client": "Invalid clientId", "statusCode": error.statusCode || 500}
    }
}
