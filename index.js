const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));


mongoose.connect('mongodb://localhost/web_chat', function (err) {
   if (err)
       throw err;
   console.log('Successfully connected');
});
const db = mongoose.connection;

app.use(session({
    secret: 'MySecretCodeIs_Pomelou',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

const routes = require('./routes/router.js');
app.use('/', routes);

server = app.listen(2000);
require('./routes/socket.js')(server);