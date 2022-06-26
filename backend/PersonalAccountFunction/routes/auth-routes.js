const passport = require("passport");
const auth = require("./auth")
const {usersModel} = require("../models/user");
const {body} = require("express-validator");
const userService = require("../services/user-service");
const mailer = require("../config/mailer.config");

module.exports.routes = (baseUrl, app) => {

    app.get(baseUrl + '/is-full-partner-info/:userEmail', async (req, res, next) => {
        let response = await userService.isFullUserInfo(req.params.userEmail, "PARTNER")
        res.send(response);
    });

    app.post(baseUrl + '/login/local', (req, res, next) => {
        passport.authenticate('local', function (err, user) {
            if (err === 403) {
                return res.status(403).json("Активируйте вашу электронную почту")
            }
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(404).json('Неправильный адрес электронной почты или пароль');
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).json({userId: user.id});
            });
        })(req, res, next);
    });

    app.get(baseUrl + '/login/headerapikey',
        passport.authenticate("headerapikey", {session: false}),
        function (req, res) {
            res.sendStatus(200);
        });

    app.get(baseUrl + '/logout',
        auth,
        (req, res) => {
            req.logOut();
            res.sendStatus(200);
        });

    app.get(baseUrl + '/is-auth',
        (req, res) => {
            res.json(req.isAuthenticated());
        });

    app.get(baseUrl + '/password-recovery/:userEmail',
        async function (req, res) {
            let user = await userService.getUserByEmail(req.params.userEmail);
            if (user) {
                if (user.isActive) {
                    await mailer.sendConfirmationPasswordRecoveryEmail(user);
                    res.sendStatus(200);
                } else res.status(404).json("Активируйте вашу почту");
            } else res.status(404).json("Неверный адрес электронной почты");
        });
    app.post(baseUrl + '/password-recovery/check-code',
        async function (req, res) {
            if (await userService.checkCode(req.body.email, req.body.code)) res.sendStatus(200);
            else res.status(404).json("Invalid code");
        });

    app.put(baseUrl + '/password-recovery/reset',
        async function (req, res) {
            const errors = await body('password').isLength({min: 5, max: 100}).run(req);
            if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

            let result = await userService.updateUserPassword(req.body.email, req.body.password);
            res
                .status(result.statusCode)
                .json("Пароль успешно сброшен!");
        });

    app.get(baseUrl + "/confirm/:confirmationCode", async (req, res, next) => {
        let user = await userService.getById(req.params.confirmationCode);
        let {email, role} = JSON.parse(JSON.stringify(user));
        if (req.params.confirmationCode === undefined) {
            if (user) {
                return res.status(404).send("User not found.");
            }
            return res.status(404).send("Invalid link");
        }
        await usersModel.update(
            {email: email, role: role},
            {
                $SET:
                    {isActive: true}
            })
        res.redirect("http://check-online-partner-bucket.s3-website.eu-central-1.amazonaws.com/confirm/"
            +req.params.confirmationCode);
    });

    app.post(baseUrl + "/confirm/withKey/:confirmationCode", async (req, res, next) => {
        let user = await userService.getById(req.params.confirmationCode);
        let {email, role} = JSON.parse(JSON.stringify(user));
        if (req.params.confirmationCode === undefined) {
            if (user) {
                return res.status(404).send("Пользователь не найден");
            }
            return res.status(404).send("Неправильная ссылка");
        }
        await usersModel.update(
            {email: email, role: role},
            {
                $SET:
                    {isActive: true}
            })
        return res.status(200).send("Успешно отправлено\nВаш ключ" + req.body.key);
    });
}
