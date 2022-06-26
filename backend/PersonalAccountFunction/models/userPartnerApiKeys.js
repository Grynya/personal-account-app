const dynamoose = require('dynamoose');
const config = require('../config/config')
const {aws: {accessKeyId, secretAccessKey, region}} = config;
dynamoose.aws.sdk.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

const UserPartnerApiKeysSchema = new dynamoose.Schema({
        key: {
            type: String,
            hashKey: true,
        },
        email: String
}
);
const UserPartnerApiKeysModel = dynamoose.model("UserPartnerApiKeys", UserPartnerApiKeysSchema, {
    "create": true,
    "waitForActive": false
});
module.exports = {userPartnerApiKeysModel: UserPartnerApiKeysModel};
