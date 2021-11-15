const AppController = require("./AppController.js");
const Socket = require("../models/Socket");
const Events = require("../utils/events.js");
const Conversation = require("../models/Conversation.js");

class MessagesController extends AppController {

    seeConversation(token, conversation_id, message_id) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.findOne({id: { "$eq": conversation_id } }).then(async conversation => {
            if (conversation === null) return this.callback({code: "NOT_FOUND_CONVERSATION", data: {}});

            let seenMessage = undefined;
            for (let index in conversation.messages) {
                if (conversation.messages[index].id === message_id) {
                    seenMessage = conversation.messages[index];
                }
            }
            if (!seenMessage) return this.callback({code: "NOT_FOUND_MESSAGE", data: {}});

            conversation.seen.set(payload.username, {message_id: message_id, time: new Date().toISOString()})

            conversation.save().then((savedConversation) => {
                Socket.emitToClients(Events.CONVERSATION_SEEN, conversation.participants, {conversation: savedConversation});
                return this.callback({ code: "SUCCESS", data: {}});
            });
        });
    }

    replyMessage(token, conversation_id, message_id, content) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.findOne({id: { "$eq": conversation_id } }).then(async conversation => {
            if (conversation === null) return this.callback({code: "NOT_FOUND_CONVERSATION", data: {}});

            let replyMessage = undefined;
            for (let index in conversation.messages) {
                if (conversation.messages[index].id === message_id) {
                    replyMessage = conversation.messages[index];
                }
            }
            if (!replyMessage) return this.callback({code: "NOT_FOUND_MESSAGE", data: {}});


            const newMessage = {
                id: new Date().valueOf(),
                conversation_id: conversation_id,
                from: payload.username,
                content: content,
                posted_at: new Date().toISOString(),
                delivered_to: [],
                reply_to: replyMessage,
                edited: false,
                deleted: false,
                reactions: {}
            };

            conversation.messages.push(newMessage);

            conversation.save().then((savedConversation) => {
                Socket.emitToClients(Events.MESSAGE_POSTED, conversation.participants, {conversation_id: conversation_id, message: newMessage});
                return this.callback({ code: "SUCCESS", data: {message: newMessage}});
            });
        });
    }

    editMessage(token, conversation_id, message_id, content) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.findOne({id: { "$eq": conversation_id } }).then(async conversation => {
            if (conversation === null) return this.callback({code: "NOT_FOUND_CONVERSATION", data: {}});

            let editedMessage = undefined;
            for (let index in conversation.messages) {
                if (conversation.messages[index].id === message_id) {
                    conversation.messages[index].content = content;
                    conversation.messages[index].edited = true;
                    editedMessage = conversation.messages[index];
                }
            }
            if (!editedMessage) return this.callback({code: "NOT_FOUND_MESSAGE", data: {}});

            conversation.save().then((savedConversation) => {
                Socket.emitToClients(Events.MESSAGE_EDITED, conversation.participants, {conversation_id: conversation_id, message: editedMessage});
                return this.callback({ code: "SUCCESS", data: {}});
            });
        });
    }

    reactMessage(token, conversation_id, message_id, reaction) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        let allowedReaction = ["SAD", "HAPPY", "THUMB", "HEART"];
        if (!allowedReaction.includes(reaction)) return this.callback({code: "NOT_VALID_CONTENT", data: {}});

        Conversation.findOne({id: { "$eq": conversation_id } }).then(async conversation => {
            if (conversation === null) return this.callback({code: "NOT_FOUND_CONVERSATION", data: {}});

            let reactMessage = undefined;
            for (let index in conversation.messages) {
                if (conversation.messages[index].id === message_id) {
                    conversation.messages[index].reactions.set(payload.username, reaction);
                    reactMessage = conversation.messages[index];
                }
            }
            if (!reactMessage) return this.callback({code: "NOT_FOUND_MESSAGE", data: {}});

            conversation.save().then((savedConversation) => {
                Socket.emitToClients(Events.MESSAGE_REACTED, conversation.participants, {conversation_id: conversation_id, message: reactMessage});
                return this.callback({ code: "SUCCESS", data: {}});
            });
        });
    }

    deleteMessage(token, conversation_id, message_id) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.findOne({id: { "$eq": conversation_id } }).then(async conversation => {
            if (conversation === null) return this.callback({code: "NOT_FOUND_CONVERSATION", data: {}});

            let deletedMessage = undefined;
            for (let index in conversation.messages) {
                if (conversation.messages[index].id === message_id) {
                    conversation.messages[index].deleted = true;
                    deletedMessage = conversation.messages[index];
                }
            }
            if (!deletedMessage) return this.callback({code: "NOT_FOUND_MESSAGE", data: {}});

            conversation.save().then(savedConversation => {
                Socket.emitToClients(Events.MESSAGE_DELETED, conversation.participants, {conversation_id: conversation_id, message_id: message_id});
                return this.callback({ code: "SUCCESS", data: {}});
            });
        });
    }

    postMessage(token, conversation_id, content) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.findOne({id: { "$eq": conversation_id } }).then(async conversation => {
            if (conversation === null) return this.callback({code: "NOT_FOUND_CONVERSATION", data: {}});

            const newMessage = {
                id: new Date().valueOf(),
                conversation_id: conversation_id,
                from: payload.username,
                content: content,
                posted_at: new Date().toISOString(),
                delivered_to: [],
                reply_to: null,
                edited: false,
                deleted: false,
                reactions: {}
            };

            conversation.messages.push(newMessage);

            conversation.save().then((conversationSaved) => {
                Socket.emitToClients(Events.MESSAGE_POSTED, conversationSaved.participants, {conversation_id: conversation_id, message: newMessage});

                return this.callback({code: "SUCCESS", data: {message: newMessage,}});
            });
        });
    }
}

module.exports = MessagesController;