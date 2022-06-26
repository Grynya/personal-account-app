const dynamoose = require('dynamoose');
const config = require('../config/config')
const {aws: {accessKeyId, secretAccessKey, region}} = config;
dynamoose.aws.sdk.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

const RegistrarInfoSchema = new dynamoose.Schema({
        registrarId: {
            hashKey: true,
            required: true,
            type: String
        },
        localNumber: {
            required: false,
            type: Number
        },
        companyName: {
            required: false,
            type: String
        },
        pointName: {
            required: false,
            type: String
        },
        pointAddress: {
            required: false,
            type: String
        },
        name: {
            required: false,
            type: String
        },
        ipn: {
            required: false,
            type: String
        },
        closed: {
            required: false,
            type: String
        },
        test: {
            required: false,
            type: String
        },
        clientId: {
            required: false,
            type: String
        },
        status: String
    }
);
const RegistrarInfoSchemaModel = dynamoose.model("RegistrarInfo", RegistrarInfoSchema, {
    "create": true,
    "waitForActive": false
});
module.exports = {registrarInfoModel: RegistrarInfoSchemaModel};
