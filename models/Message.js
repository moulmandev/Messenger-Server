const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const messageSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    posted_at: {
        type: Data,
        required: true
    },
    delivered_to: {
        type: Array,
        required: false
    },
    reply_to: {
        type: Array,
        required: false
    },
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
}, { minimize: false });
messageSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('Message', messageSchema);
