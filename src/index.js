const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.set('/static', express.static('static'));
app.get('/', function (req, res) {
    res.render('index', {username: 'den'});
});

app.listen(5000);