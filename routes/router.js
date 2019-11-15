const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/chat', function (req, res) {
    res.render('chat');
});

router.get('/signin', function (req, res) {
    res.render('login');
});

router.post('/signin', function (req, res, next) {
    let form = req.body;
    if (form.username && form.password) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

router.get('/signup', function (req, res) {
    res.render('registration');
});

router.post('/signup', function (req, res, next) {
    let form = req.body;

    if (form.password !== form.password2) {
        let err = new Error('Passwords do not match.');
        err.status = 400;
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
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

router.get('/logout', function (req, res) {
    res.redirect('/');
});

router.get('/profile', function (req, res) {
    let user = User.find();

});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(null, true);
    }
    res.redirect('/signin');
}

module.exports = router;
