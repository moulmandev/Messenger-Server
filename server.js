require('dotenv/config');
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const config = require("./config.js");
const Events = require("./utils/events.js");

mongoose.connect(config.mongodb_uri,() => console.log('[MongoDB] Successfully connected'));

const UsersController =  require("./controllers/UsersController.js")
const ConversationsController =  require("./controllers/ConversationsController.js")
const MessagesController =  require("./controllers/MessagesController.js")

const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
    res.send("A utiliser pour du debug si vous avez besoin...");
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log("[Express] Server is listening port " + PORT);
});

io.on("connection", socket => {
    socket.on(Events.AUTHENTICATE, ({ username, password }, callback) => new UsersController(callback, io).authenticate(username, password, socket));
    
    socket.on(Events.GET_USERS, ({token}, callback) => new UsersController(callback, io).getUsers(token));
    socket.on(Events.CREATE_ONE_TO_ONE_CONVERSATION, ({token, username}, callback) => new ConversationsController(callback, io).getOrCreateOneToOneConversation(token, username));
    socket.on(Events.CREATE_MANY_TO_MANY_CONVERSATION, ({token, usernames}, callback) => new ConversationsController(callback, io).createManyToManyConversation(token, usernames));
    socket.on(Events.GET_CONVERSATIONS, ({token}, callback) => new ConversationsController(callback, io).getConversations(token));
    
    socket.on(Events.POST_MESSAGE, ({token, conversation_id, content}, callback) => new MessagesController(callback, io).postMessage(token, conversation_id, content));
    socket.on(Events.SEE_CONVERSATION, ({token, conversation_id, message_id}, callback) => new MessagesController(callback, io).seeConversation(token, conversation_id, message_id));
    socket.on(Events.REPLY_MESSAGE, ({token, conversation_id, message_id, content}, callback) => new MessagesController(callback, io).replyMessage(token, conversation_id, message_id, content));
    socket.on(Events.EDIT_MESSAGE, ({token, conversation_id, message_id, content}, callback) => new MessagesController(callback, io).editMessage(token, conversation_id, message_id, content));
    socket.on(Events.REACT_MESSAGE, ({token, conversation_id, message_id, reaction}, callback) => new MessagesController(callback, io).reactMessage(token, conversation_id, message_id, reaction));
    socket.on(Events.DELETE_MESSAGE, ({token, conversation_id, message_id, content}, callback) => new MessagesController(callback, io).deleteMessage(token, conversation_id, message_id, content));

    socket.on(Events.DISCONNECT, (reason) => new UsersController(null, io).disconnect());
});