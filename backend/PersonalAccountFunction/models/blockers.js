const dynamoose = require('dynamoose');
const config = require('../config/config')
const {aws: {accessKeyId, secretAccessKey, region}} = config;
dynamoose.aws.sdk.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

const BlockersSchema = new dynamoose.Schema({
        clientId: {
            hashKey: true,
            required: true,
            type: String
        },
        registrarId: {
            rangeKey: true,
            required: true,
            type: String
        },
        message: String
    }
);

const BlockersModel = dynamoose.model("Blockers", BlockersSchema, {
    "create": true,
    "waitForActive": false
});
module.exports = {blockersModel: BlockersModel};
