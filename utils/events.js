const UsersController = require("../controllers/UsersController.js");
const ConversationsController = require("../controllers/ConversationsController.js");
const MessagesController = require("../controllers/MessagesController.js");

class Events {
    static eventList = {
        //CLIENT
        AUTHENTICATE: "@authenticate",
        GET_USERS: "@getUsers",
        CREATE_ONE_TO_ONE_CONVERSATION: "@getOrCreateOneToOneConversation",
        CREATE_MANY_TO_MANY_CONVERSATION: "@createManyToManyConversation",
        GET_CONVERSATIONS: "@getConversations",
        POST_MESSAGE: "@postMessage",
        SEE_CONVERSATION: "@seeConversation",
        REPLY_MESSAGE: "@replyMessage",
        EDIT_MESSAGE: "@editMessage",
        REACT_MESSAGE: "@reactMessage",
        DELETE_MESSAGE: "@deleteMessage",
        DISCONNECT: "disconnect",
        //SERVER
        CONVERSATION_CREATED: "@conversationCreated",
        USER_CREATED: "@userCreated",
        MESSAGE_POSTED: "@messagePosted",
        CONVERSATION_SEEN: "@conversationSeen",
        MESSAGE_REACTED: "@messageReacted",
        MESSAGE_EDITED: "@messageEdited",
        MESSAGE_DELETED: "@messageDeleted",
    }
}

module.exports = Events.eventList;

