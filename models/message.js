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

let Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
