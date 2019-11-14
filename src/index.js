const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

require('./routes.js')(app);

server = app.listen(2000);
const io = require("socket.io")(server);
