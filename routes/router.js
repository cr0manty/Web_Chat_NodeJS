const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');

const urlencodeParser = bodyParser.urlencoded({extended: false});


router.get('/', function (req, res) {
    res.render('index');
});

router.get('/chat', function (req, res) {
    res.render('chat');
});

router.get('/signin', function (req, res) {
    res.render('login');
});

router.post('/signin', urlencodeParser, function (req, res) {
    res.render('profile');
});

router.get('/signup', function (req, res) {
    res.render('registration');
});

router.post('/signup', urlencodeParser, function (req, res) {
    res.render('login');
});

router.get('/logout', function (req, res) {
    res.render('index');
});

router.get('/profile', function (req, res) {

});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(null, true);
    }
    res.redirect('/signin');
}

module.exports = router;
