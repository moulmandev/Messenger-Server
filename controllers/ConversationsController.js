const AppController = require("./AppController.js");
const Events = require("../utils/events.js")
const Conversation = require("../models/Conversation.js");

class ConversationsController extends AppController {

    getOrCreateOneToOneConversation(token, username) {
        let payload = this.verifyAuth(token);
        if (!payload) return this.callback({code:"NOT_AUTHENTICATED", data:{}});

        Conversation.findOne({ participants: { "$in" : [payload.username, username]} }).then(conversation => {
            if (conversation === null) {
                const conversation = new Conversation({
                    type: "one_to_one",
                    participants: [payload.username, username],
                    messages: [],
                    title: "Nouvelle conversation",
                    theme: "BLUE",
                    updated_at: new Date().toISOString(),
                    seen: {},
                    typing: {}
                });

                conversation.save().then((savedConversation) => {
                    return this.callback({
                        code: "SUCCESS",
                        data: {
                            conversation: {
                                savedConversation,
                            }
                        },
                    });
                });
            } else {


                console.log(conversation);

                return this.callback({
                    code: "SUCCESS",
                    data: {
                        conversation: {
                            conversation,
                        }
                    },
                });
            }
        });
    }

    createManyToManyConversation(token, usernames) {
        this.callback({code:"SUCCESS", data:{}});
    }

    getConversations(token) {
        this.callback({code:"SUCCESS", data:{}});
    }
}

module.exports = ConversationsController;