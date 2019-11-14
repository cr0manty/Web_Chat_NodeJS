const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.render('index', {username: 'den'});
});

app.get('/chat', function (req, res) {
   res.render('chat');
});
server = app.listen(2000);
const io = require("socket.io")(server);
