const dynamoose = require('dynamoose');
const config = require('../config/config')
const {aws: {accessKeyId, secretAccessKey, region}} = config;
dynamoose.aws.sdk.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

const UserSchema = new dynamoose.Schema({
        id: {
            type: String,
            index: {
                name: "idIndex",
                global: true
            }
        },
        companyName: String,
        phone: String,
        inn: String,
        email: {
            hashKey: true,
            required: true,
            type: String,
            index: {
                name: "emailIndex",
                global: true
            }
        },
        password: {
            required: true,
            type: String
        },
        clientIds:
            {
                type: Array,
                schema: [{
                    type: String
                }]
            },
        registrarIds:
            {
                type: Array,
                schema: [{
                    type: String
                }]
            },
        isDeleted: {
            type: Boolean,
            default: false
        },
        role: {
            rangeKey: true,
            required: true,
            type: String
        },
        isActive: {
            type: Boolean,
            default: false
        },
        code: String //hashed
    }
);
//todo:timestamps
const UsersModel = dynamoose.model("Users", UserSchema, {
    "create": true,
    "waitForActive": false
});
module.exports = {usersModel: UsersModel};
