const jwt = require("jsonwebtoken");
const config = require("../config.js");

class AppController {
    constructor(callback, socket) {
        this.callback = callback;
        this.socket = socket;
    }

    verifyAuth(token) {
        let decode = jwt.decode(token, config.jwt_key);
        if (!decode)
            return null;
        return decode;
    }
}

module.exports = AppController;