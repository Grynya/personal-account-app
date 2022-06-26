const dynamoose = require('dynamoose');
const config = require('../config/config')
const {aws: {accessKeyId, secretAccessKey, region}} = config;
dynamoose.aws.sdk.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

const PaymentsSchema = new dynamoose.Schema({
        registrarId: {
            hashKey: true,
            required: true,
            type: String
        },
        clientId: {
            type: String,
            index: {
                global: true,
                name: "PaymentsByClientId",
                hashKey: "clientId",
                rangeKey: "registrarId"
            }
        },
        paidFrom: String,
        duration: String,
        paidUntil: {
            rangeKey: true,
            required: true,
            type: String
        },
        amount: String,
        comment: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

const PaymentsModel = dynamoose.model("Payments", PaymentsSchema, {
    "create": true,
    "waitForActive": false
});
module.exports = {paymentsModel: PaymentsModel};
