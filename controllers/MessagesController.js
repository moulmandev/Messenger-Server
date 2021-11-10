const AppController = require("./AppController.js");

class MessagesController extends AppController {

    seeConversation(token, conversation_id, message_id) {
        this.callback({code:"SUCCESS", data:{}});
    }

    replyMessage(token, conversation_id, message_id, content) {
        this.callback({code:"SUCCESS", data:{}});
    }

    editMessage(token, conversation_id, message_id, content) {
        this.callback({code:"SUCCESS", data:{}});
    }

    reactMessage(token, conversation_id, message_id, reaction) {
        this.callback({code:"SUCCESS", data:{}});
    }

    deleteMessage(token, conversation_id, message_id, content) {
        this.callback({code:"SUCCESS", data:{}});
    }

    postMessage(token, conversation_id, content) {
        this.callback({code:"SUCCESS", data:{}});
    }
}

module.exports = MessagesController;