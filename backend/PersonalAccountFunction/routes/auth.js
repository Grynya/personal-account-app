'use strict'

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) next(); else res.status(401).json("Пожалуйста, войдите");
}
module.exports = checkAuthentication;
