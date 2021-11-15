const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const AppController = require("./AppController.js");
const config = require("../config.js");
const picture =  require("../utils/pictures.js")
const User = require("../models/User");
const Socket = require("../models/Socket");
const Events = require("../utils/events.js");

class UsersController extends AppController {

    authenticate(username, password, clientSocket) {
        let returned = null;
        let token = jwt.sign({
            username: username
        }, config.jwt_key);

        User.findOne({ username: username }).then(user => {
            if (user === null) {
                bcrypt.hash(password, 10).then(hash => {
                    const user = new User({
                        username: username,
                        password: hash,
                        picture_url: picture.getRandomURL(),
                        last_activity_at: new Date().toISOString(),
                        awake: true,
                    });
                    user.save().then((savedUser) => {

                        this.socket.emit(Events.USER_CREATED, {
                            user: {
                                username: savedUser.username,
                                picture_url: savedUser.picture_url,
                                last_activity_at: savedUser.last_activity_at
                            },
                        });

                        Socket.clientSockets[savedUser.username] = this.socket;

                        return this.callback({
                            code: "SUCCESS",
                            data: {
                                username: savedUser.username,
                                picture_url: savedUser.picture_url,
                                token: token,
                            },
                        });
                    });
                });
            } else {
                bcrypt.compare(password, user.password).then(valid => {
                    if (!valid) {
                        return this.callback({
                            code: "NOT_AUTHENTICATED",
                            data: {},
                        });
                    }

                    Socket.clientSockets[user.username] = this.socket;

                    return this.callback({
                        code: "SUCCESS",
                        data: {
                            username: user.username,
                            picture_url: user.picture_url,
                            token: token,
                        },
                    });
                });
            }
        });


    }

    getUsers(token) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        User.find().select('-password').then(users => {
            this.callback({
                code: "SUCCESS",
                data: {
                    users: users
                },
            });
        });
    }

    disconnect() {
        Socket.removeSocketFromList(this.socket);
    }
}

module.exports = UsersController;