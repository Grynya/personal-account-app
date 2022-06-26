const express = require('express');
const userRoutes = require("./routes/user-routes");
const clientRoutes = require("./routes/client-routes");
const paymentRoutes = require("./routes/payment-routes");
const reportRoutes = require("./routes/report-routes");
const registrarRoutes = require("./routes/registrar-routes");
const session = require("express-session");
const passport = require("passport");
const DynamoDBStore = require('dynamodb-store');
const config = require("./config/config");
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

let swaggerDocument;

module.exports = function createServer() {
    const app = express();
    app.use(
        cors({
            origin: true,
            credentials: true,
            optionsSuccessStatus: 200
        }))
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(session({
        secret: 'okgtdesvh',
        store: new DynamoDBStore(config.optionsForDynamoStore),
        cookie: {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 24 * 1000
        },
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.session());
    require('./config/config-passport');

    require("./routes/auth-routes").routes("/app/v1", app);
    app.use("/app/v1/users", userRoutes)
    app.use("/app/v1/clients", clientRoutes)
    app.use("/app/v1/payments", paymentRoutes)
    app.use("/app/v1/reports", reportRoutes);
    app.use("/app/v1/registrars", registrarRoutes);
    app.use('/app/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    return app;
}
