class Socket {
    static clientSockets = {};

    static removeSocketFromList(target, socket) {
        for (let socket in Socket.clientSockets) {
            if (Socket.clientSockets[socket] === socket)
                delete Socket.clientSockets[socket];
        }
    }

    static emitToClients(event, target, data) {
        let targets = [...target];

        for (let user in targets) {
            if (targets[user] in Socket.clientSockets)
                Socket.clientSockets[targets[user]].emit(event, data);
        }
    }
}

module.exports = Socket;