const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    createdDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    Room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
});

module.exports = mongoose.model('Message', MessageSchema);
