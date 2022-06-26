const dynamoose = require('dynamoose');
const config = require('../config/config')
const {aws: {accessKeyId, secretAccessKey, region}} = config;
dynamoose.aws.sdk.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

const ClientSchema = new dynamoose.Schema({
        id: {
            hashKey: true,
            required: true,
            type: String
        },
        partnerId: {
            required: true,
            type: String
        },
        name: String,
        company: String,
        phone: String,
        email: String,
        comment: String,
        registrarIds:
            {
                type: Array,
                schema: [{
                    type: String
                }],
                default: []
            },
        isDeleted: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "active"
        }
    }
);

const ClientsModel = dynamoose.model("ClientsV2", ClientSchema, {
    "create": true,
    "waitForActive": false
});
module.exports = {clientsModel: ClientsModel};
