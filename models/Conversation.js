const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const conversationSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true
    },
    messages: {
        type: Array,
        required: true
    },
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
conversationSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('Conversation', conversationSchema);