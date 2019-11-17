const Message = require('../models/message');
const Room = require('../models/room');

module.exports = function (server) {
    const io = require("socket.io")(server);

    io.sockets.on('connection', function (socket) {
        socket.on('username', function (user, room) {
            Room.find({_id: room._id}, function (err, room) {
                if (room) {
                    room.active_user++;
                    room.roomUsers.push(user);
                    io.emit('options', user.username + ' join the chat...');
                }
            });
        });

        socket.on('disconnect', function (user, room) {
            Room.find({_id: room._id}, function (err, room) {
                if (room) {
                    room.active_user--;
                    room.roomUsers.pop(user);
                    io.emit('settings', user.username + ' left the chat..');
                }
            });
        });

        socket.on('message', function (user, text, room) {
            Message.create({
                author: user,
                text: text,
                room: room
            }, function (err, message) {
                if (!err) {
                    io.emit('message', user.username + ': ' + message.text);
                }
            });
        });

    });
};