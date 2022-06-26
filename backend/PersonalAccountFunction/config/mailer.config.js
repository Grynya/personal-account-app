const {usersModel} = require("../models/user");
const Encryptor = require('../utils/encryptor')
const emailSender = require('./ses-email-sender')

module.exports.sendConfirmationRegistrationEmail = async (userToCreate, confirmationCode) => {
    await emailSender.sendMail(userToCreate.email, "Подтверждение email", `<h1>Подтверждение email</h1>
        <h2>Здраствуйте</h2>
        <p>Спасибо за регистрацию. Пожалуйста, подтвердите свой адрес электронной почты, нажав на следующую ссылку</p>
                      <a href=https://87kmmgud1h.execute-api.eu-central-1.amazonaws.com/app/v1/confirm/${confirmationCode}>Нажмите здесь</a>
        </div>`)
};

module.exports.sendConfirmationPasswordRecoveryEmail = async (userToUpdate) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const hashedCode = await Encryptor.hashPassword(code.toString());
    await usersModel.update(
        {email: userToUpdate.email, role: userToUpdate.role},
        {
            $SET:
                {code: hashedCode}
        })
    await emailSender.sendMail(userToUpdate.email, "Пожалуйста, подтвердите восстановление пароля", `<h1>Подтверждение электронного адреса</h1>
    <h2>Здраствуйте</h2>
    <p>Для восстановления пароля введите этот код</p>
    <h1>${code}</h1>
</div>`)
};
