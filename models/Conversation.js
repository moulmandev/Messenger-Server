const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(({
    id: {
        type: Number,
        required: true
    },
    conversation_id: {
        type: Number,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    posted_at: {
        type: Date,
        required: true
    },
    delivered_to: {
        type: Array,
        required: false
    },
    reply_to: this,
    edited: {
        type: Boolean,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    },
    reactions: {
        type: Map,
        required: true
    },
}));

const conversationSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true
    },
    messages: [messageSchema],
    title: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    seen: {
        type: Map,
        required: true
    },
    typing: {
        type: Map,
        required: true
    },
}, { minimize: false });

module.exports = mongoose.model('Conversation', conversationSchema);