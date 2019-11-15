var socket;

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
        socket.emit('options', {}, function () {
        });
    }
}

$(document).ready(function () {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    socket.on('connect', function () {
        socket.emit('options', {});
    });
    socket.on('message', function (data) {
        var chat = document.getElementById("chat");
        chat.value += data.msg + '\n';
        chat.scrollTop = chat.scrollHeight;
    });
    socket.on('options', function (data) {
        var chat = document.getElementById("chat");
        chat.value += data.msg + '\n';
        chat.scrollTop = chat.scrollHeight;
    });
    $('#text').keypress(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            send_message();
        }
    });
    socket.on('disconnect', function () {
        window.location.href = "{{ url_for('index') }}";
    });
});

function send_message() {
    text = document.getElementById("text").value;
    document.getElementById("text").value = '';
    socket.emit('message', {msg: text});
}