const AppController = require("./AppController.js");
const Events = require("../utils/events.js")
const Conversation = require("../models/Conversation.js");
const Socket = require("../models/Socket");

class ConversationsController extends AppController {

    getOrCreateOneToOneConversation(token, username) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.findOne({ participants: { "$all" : [payload.username, username]}, type: { "$eq": "one_to_one" } }).then(conversation => {
            if (conversation === null) {
                const newConversation = new Conversation({
                    type: "one_to_one",
                    participants: [payload.username, username],
                    messages: [],
                    title: "Nouvelle conversation",
                    theme: "BLUE",
                    updated_at: new Date().toISOString(),
                    seen: {},
                    typing: {}
                });

                newConversation.save().then((savedConversation) => {

                    Socket.emitToClients(Events.CONVERSATION_CREATED, savedConversation.participants, {conversation: savedConversation});

                    return this.callback({
                        code: "SUCCESS",
                        data: {
                            conversation: savedConversation,
                        },
                    });
                });
            } else {
                return this.callback({
                    code: "SUCCESS",
                    data: {
                        conversation: conversation,
                    },
                });
            }
        });
    }

    createManyToManyConversation(token, usernames) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        let usernamesQuery = [...usernames, payload.username];

        Conversation.find({ participants: { "$all" : usernamesQuery}, type: { "$eq": "many_to_many" } }).then(conversation => {
            if (conversation.length === 0) {
                const newConversation = new Conversation({
                    type: "many_to_many",
                    participants: usernamesQuery,
                    messages: [],
                    title: "Nouvelle conversation",
                    theme: "BLUE",
                    updated_at: new Date().toISOString(),
                    seen: {},
                    typing: {}
                });

                newConversation.save().then((savedConversation) => {

                    Socket.emitToClients(Events.CONVERSATION_CREATED, savedConversation.participants, {conversation: savedConversation});

                    return this.callback({
                        code: "SUCCESS",
                        data: {
                            conversation: savedConversation,
                        },
                    });
                });
            } else {
                return this.callback({
                    code: "SUCCESS",
                    data: {
                        conversation: conversation,
                    },
                });
            }
        });
    }

    getConversations(token) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.find({ participants: { "$in" : payload.username} }).then(conversations => {
            if (conversations != null) {
                return this.callback({
                    code: "SUCCESS",
                    data: {
                        conversations: conversations,
                    },
                });
            }
        });
    }
}

module.exports = ConversationsController;