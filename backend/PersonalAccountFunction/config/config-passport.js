const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const userController = require('../services/user-service')
const {userPartnerApiKeysModel} = require("../models/userPartnerApiKeys");
const {usersModel} = require("../models/user");
passport.initialize();

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, {
            id: user.id, name: user.name, surname: user.surname, email: user.email, password: user.password,
            registrarsId: user.registrarsId
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
passport.use(
    new LocalStrategy({usernameField: 'email'}, async function (
            email,
            password,
            done
        ) {
            const user = await userController.getUserByEmailAndPassword(email, password);
            if (user) {
                if (!user.isActive) return done(403, false);
                return done(null, user);
            } else return done(null, false);
        }
    )
);

passport.use(new HeaderAPIKeyStrategy(
    {header: 'api-key', prefix:''}, false,
    async function (apikey, done) {
        const {email} = JSON.parse(JSON.stringify(await userPartnerApiKeysModel.get(apikey)));
        const user = await usersModel.get({email: email, role: "PARTNER"});
        if (user) {
            if (user.isActive === false) return done("Activate your email", false);
            return done(null, user);
        } else return done(null, false);
    }
));
