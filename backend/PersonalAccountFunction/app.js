'use strict'
const createServer = require('./server')
const config = require('./config/config')
const app = createServer()

app.listen(config.app.port, () => console.log(`App is listening on port ${config.app.port}!`));
module.exports = app;
