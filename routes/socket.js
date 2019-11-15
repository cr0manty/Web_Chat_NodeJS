const Message = require('../models/message');

module.exports = function (server) {
    const io = require("socket.io")(server);

    io.sockets.on('connection', function (socket) {
        socket.on('username', function (username) {
            socket.username = username;
            io.emit('options', socket.username + ' join the chat..');
        });

        socket.on('disconnect', function (username) {
            io.emit('settings', socket.username + ' left the chat..');
        });

        socket.on('message', function (message) {
            let msg = new Message(message);
            io.emit('message', socket.username + ': ' + message);
        });

    });
};