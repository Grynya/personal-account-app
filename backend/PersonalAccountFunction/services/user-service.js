'use strict';

const uuid = require('uuid');
const {usersModel} = require('../models/user');
const Encryptor = require('../utils/encryptor')
const clientService = require('./client-service')
const {clientsModel} = require("../models/client");
const generateApiKey = require('generate-api-key');
const {userPartnerApiKeysModel} = require("../models/userPartnerApiKeys");

const bcrypt = require("bcrypt");
module.exports.isFullUserInfo = async (userEmail, role) => {
    let user = await usersModel.get({email: userEmail, role: role})
    let {companyName, phone, inn} = JSON.parse(JSON.stringify(user));
    return !!(companyName && phone && inn);
}

module.exports.createUserPartner = async (user) => {
    let input = user;
    try {
        let {email, password} = JSON.parse(JSON.stringify(input));
        let user = await this.getUserByEmail(email);
        if (user !== undefined) {
            let {isDeleted} = JSON.parse(JSON.stringify(user));
            if (!isDeleted) return {
                "generatedId": "Пользователь с электронной почтой " + email + " уже существует",
                "statusCode": 404
            }
        } else {
            let hashedPassword = await Encryptor.hashPassword(password);
            let generatedId = uuid.v4();
            await usersModel.create({
                id: generatedId,
                email,
                password: hashedPassword,
                role: "PARTNER",
                clientIds: []
            });
            return {"generatedId": generatedId, "statusCode": 200}
        }
    } catch (error) {
        console.log(error);
        return {"generatedId": "", "statusCode": error.statusCode || 500}
    }
};
module.exports.completeUserPartner = async (input) => {
    try {
        let user = await usersModel.get({email: input.email, role: "PARTNER"});
        if (user) {
            return {
                "user": await usersModel.update(
                    {email: input.email, role: "PARTNER"},
                    {
                        $SET:
                            {
                                companyName: input.companyName,
                                phone: input.phone,
                                inn: input.inn
                            }
                    }), "statusCode": 200
            }
        } else return {"user": "No user with such email", "statusCode": 200};
    } catch (error) {
        console.log(error)
        return {"user": "No user with such email", "statusCode": error.statusCode || 500};
    }
}
module.exports.createUserPartnerWitApiKey = async (user) => {
    try {
        const res = await this.createUserPartner(user);
        const key = generateApiKey();
        await userPartnerApiKeysModel.create({key: key, email: user.email});
        return {"generatedId": res.generatedId, "statusCode": 200}
    } catch
        (error) {
        console.log(error);
        return {"generatedId": "", "statusCode": error.statusCode || 500}
    }
}
;
module.exports.createUser = async (user) => {
    let input = user;
    try {
        let {companyName, email, password, inn} = JSON.parse(JSON.stringify(input));
        let user = await this.getUserByEmail(email);
        if (user !== undefined) {
            let {isDeleted} = JSON.parse(JSON.stringify(user));
            if (!isDeleted) return {
                "userCredentials": "User with email " + email + " already exists",
                "statusCode": 404
            }
            return {"userCredentials": "User with email " + email + " already exists", "statusCode": 404}
        } else {
            let hashedPassword = await Encryptor.hashPassword(password);
            let generatedId = uuid.v4();
            let res = await usersModel.create({
                id: generatedId,
                companyName,
                email,
                password: hashedPassword,
                inn,
                role: "USER",
                registrarIds: []
            });
            return {"userCredentials": res, "statusCode": 200}
        }
    } catch (error) {
        console.log(error);
        return {"userCredentials": "", "statusCode": error.statusCode || 500}
    }
}

module.exports.getAllUsers = async () => {
    try {
        let users = await usersModel.scan().where("isDeleted").eq(false).exec();
        let moreUsers = await usersModel
            .scan()
            .where("isDeleted")
            .eq(false)
            .startAt(users.lastKey)
            .exec();
        return {"users": moreUsers, "statusCode": 200};
    } catch (error) {
        return {"users": "", "statusCode": error.statusCode || 500};
    }
};

module.exports.getUserByEmailAndPassword = async (email, password) => {
    try {
        let user = await usersModel.query("email").eq(email).exec();
        let {isDeleted} = JSON.parse(JSON.stringify(user));
        if (user.count > 0 && !isDeleted) {
            if (await Encryptor.validPassword(password, user[0])) {
                return user[0]
            }
        } else return undefined
    } catch (error) {
        return error.statusCode || 500
    }
};

module.exports.getUserByEmail = async (email) => {
    try {
        let user = (await usersModel.query("email").eq(email).exec());
        if (user.count === 0) {
            return undefined
        } else return user[0]
    } catch (error) {
        console.log(error);
        return error.statusCode || 500
    }
};

module.exports.updateUserPassword = async (email, newPassword) => {
    try {
        let user = await this.getUserByEmail(email);
        if (user) {
            let hashedPassword = await Encryptor.hashPassword(newPassword)
            return {
                "user": await usersModel.update(
                    {email: user.email, role: user.role},
                    {
                        $SET:
                            {password: hashedPassword}
                    }), "statusCode": 200
            }
        } else return {"user": "No user with such email", "statusCode": 200};
    } catch (error) {
        console.log(error)
        return {"user": "No user with such id", "statusCode": error.statusCode || 500};
    }
};
/**
 * Function saves client and adds it to user's array
 * @param userId id of user which will contain client
 * @param client client object
 * @returns {Promise<number|*>} updated user with client
 */
module.exports.addClient = async (userId, client) => {
    try {
        let user = await this.getById(userId);
        console.log(userId);
        let {email, role} = JSON.parse(JSON.stringify(user));
        let res = await clientService.createClient(userId, client);
        if (res.statusCode === 200) {
            let updatedUser = await usersModel.update(
                {email: email, role: role},
                {
                    $ADD:
                        {clientIds: [res.generatedId]}
                }
            );
            return {"user": updatedUser, "statusCode": 200};
        } else return {"user": "Invalid userId", "statusCode": 500};
    } catch (error) {
        console.log(error);
        return {"user": "Invalid userId", "statusCode": error.statusCode || 500};
    }
};
/**
 * @returns {Promise<{clients: any, statusCode: number}|{clients: string, statusCode: number}>} clients of user
 * @param userId id of the user you want to get clients
 */
module.exports.getAllClients = async (userId) => {
    try {
        let user = await this.getById(userId);
        let res = [];
        let {clientIds} = JSON.parse(JSON.stringify(user));
        for (let clientId of clientIds) {
            let client = await clientsModel.get(clientId);
            if (!client.isDeleted) res.push(client);
        }
        return {"clients": res, "statusCode": 200};
    } catch (error) {
        return {"clients": "Invalid userId", "statusCode": error.statusCode || 500};
    }
};
module.exports.getAllDeletedClients = async (userId) => {
    try {
        let user = await this.getById(userId);
        let res = [];
        let {clientIds} = JSON.parse(JSON.stringify(user));
        for (let clientId of clientIds) {
            let client = await clientsModel.get(clientId);
            if (client.isDeleted) res.push(client);
        }
        return {"clients": res, "statusCode": 200};
    } catch (error) {
        return {"clients": "Invalid userId", "statusCode": error.statusCode || 500};
    }
};
/**
 * Function grants permission to user on client by adding clientId in field clientIds (array with registrars ids)
 * @param userId id of the user to which you want to grand permission
 * @param clientId id of the client to which you grant permission
 * @returns {Promise<{payment: *, statusCode: number}|{payment: string, statusCode: number}>} the object with updated
 * user with client id and status code
 */
module.exports.grantPermissionsToUser = async (userId, clientId) => {
    try {
        let user = await this.getById(userId);
        let {email, role} = JSON.parse(JSON.stringify(user));
        if (role === "PARTNER") {
            let res = await usersModel.update(
                {email: email, role: role},
                {
                    $ADD:
                        {clientIds: [clientId]}
                }
            );
            return {"user": res, "statusCode": 200}
        }
        return {"user": "Illegal role", "statusCode": 200}
    } catch (error) {
        console.log(error);
        return {"user": "", "statusCode": error.statusCode || 500}
    }
}

module.exports.addRegistrar = async (userId, registrarId) => {
    try {
        let user = await this.getById(userId);
        let {email, role} = JSON.parse(JSON.stringify(user));
        if (role === "USER") {
            let res = await usersModel.update(
                {email: email, role: role},
                {
                    $ADD:
                        {registrarIds: [registrarId]}
                }
            );
            return {"user": res, "statusCode": 200}
        }
        return {"user": "Illegal role", "statusCode": 200}
    } catch (error) {
        console.log(error);
        return {"user": "", "statusCode": error.statusCode || 500}
    }
}
module.exports.deleteUser = async (id) => {
    try {
        let user = await this.getById(id);
        let {email, role} = JSON.parse(JSON.stringify(user));
        return {
            "deleted": await usersModel.update(
                {email: email, role: role},
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
/**
 * @param id
 * @returns {Promise<*>} user by id (global index on id exists)
 */
module.exports.getById = async (id) => {
    return (await usersModel.query("id").eq(id).exec())[0];
}
module.exports.checkCode = async (email, code) => {
    const user = await this.getUserByEmail(email);
    if (user) {
        if (await bcrypt.compare(code, user.code)) {
            await usersModel.update(
                {email: user.email, role: user.role},
                {
                    $SET:
                        {code: "", isActive: true}
                })
            return true;
        }
    } else return false;
}

module.exports.makeUserActive = async (userId) => {
    let user = await this.getById(userId);
    let {email, role} = JSON.parse(JSON.stringify(user));
    if (userId === undefined) {
        if (user) {
            return "User not found.";
        }
        return "Invalid link";
    }
    return {
        statusCode: 200, user: await usersModel.update(
            {email: email, role: role},
            {
                $SET:
                    {isActive: true}
            })
    }
}
