let socket;

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
        socket.emit('options', {}, function () {
        });
    }
}

function connect(user, room) {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/room/' + room.name);
    socket.emit('connect', {user: user, room: room});
}

$(document).ready(function () {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/room/');

    socket.on('message', function (data) {
        socket = io.connect('http://' + document.domain + ':' + location.port + '/room/' + room.name);

        const chat = document.getElementById("chat");
        chat.value += data.msg + '\n';
        chat.scrollTop = chat.scrollHeight;
    });
    socket.on('options', function (data) {
        const chat = document.getElementById("chat");
        chat.value += data.msg + '\n';
        chat.scrollTop = chat.scrollHeight;
    });
    $('#text').keypress(function (e) {
        const code = e.keyCode || e.which;
        if (code === 13) {
            send_message();
        }
    });
    socket.on('disconnect', function () {
        window.location.href = "/";
        socket.emit('connect', {});
    });
});

function send_message(user, room) {
    const text = document.getElementById("text").value;
    document.getElementById("text").value = '';
    socket.emit('message', {user: user, room: room, text: text});
}