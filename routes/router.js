const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

const urlencodedParser = bodyParser.urlencoded({extended: false});

function getUser(id) {
    let user = User.findOne(id);
    if (!user) {
        req.session.is_auth = false;
    }
    return user;
}

router.get('/', function (req, res) {
    let user = null;
    if (req.session.is_auth) {
        user = getUser(req.session.user_id);
    }
    res.render('index');
});

router.get('/chat', function (req, res) {
    if (req.session.room) {
        res.render('chat');
    }
    else {
        res.redirect('/')
    }
});

router.get('/signin', function (req, res) {
    if (!req.session.is_auth)
        res.render('login');
    else
        res.redirect('/');
});

router.post('/signin', urlencodedParser, function (req, res, next) {
    let form = req.body;
    if (form.username && form.password) {
        User.authenticate(form.username, form.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong username or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.user_id = user._id;
                req.session.is_auth = true;
                return res.redirect('/profile');
            }
        });
    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        req.session.is_auth = false;
        return next(err);
    }
});

router.get('/signup', function (req, res) {
    if (!req.session.is_auth)
        res.render('registration');
    else
        req.redirect('/');
});

router.post('/signup', urlencodedParser, function (req, res, next) {
    let form = req.body;

    if (form.password !== form.password2) {
        let err = new Error('Passwords do not match.');
        err.status = 400;
        req.session.is_auth = false;
        res.send('Passwords do not match.');
        return next(err);
    }

    if (form.username && form.firstName &&
        form.lastName && form.password) {
        let data = {
            username: form.username,
            firstName: form.firstName,
            lastName: form.lastName,
            password: form.password
        };

        User.create(data, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.user_id = user._id;
                req.session.is_auth = true;
                return res.redirect('/signin');
            }
        });
    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        req.session.is_auth = false;
        return next(err);
    }
});

router.get('/logout', function (req, res) {
    req.session.is_auth = false;
    req.session.user_id = -1;
    res.redirect('/');
});

router.get('/profile', function (req, res) {
    if (req.session.is_auth) {
        let user = getUser(req.session.user_id);
        res.render('profile', {
            username: user.name,
        });
    }
    res.redirect('/signin');
});

module.exports = router;
