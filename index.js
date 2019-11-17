const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const port = 2000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/web_chat', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
   if (err)
       throw err;
   console.log('Successfully connected to mongodb');
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', console.error.bind(console, 'Connected:'));

app.use(session({
    secret: 'MySecretCodeIs_Pomelou',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

const router = require('./routes/router.js');
app.use('/', router);

const server = app.listen(port, function () {
    console.log('127.0.0.1:' + port)
});
require('./routes/socket.js')(server);