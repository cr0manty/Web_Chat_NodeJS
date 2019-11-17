const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/room');
const Message = require('../models/message');

router.get('/', function (req, res) {
    Room.find({}, function (err, rooms) {
        res.render('index', {
            is_auth: req.session.is_auth,
            user: req.session.user,
            rooms: rooms
        });
    })
});

router.get('/room/:name', function (req, res, next) {
    if (!req.session.is_auth) {
        const err = new Error('You must be logged in to view the room');
        err.status = 403;
        return next(err);
    }
    Room.find({name: req.params.name}, async function (err, room) {
        if (err || !room) {
            res.send(404);
        } else {
            const messages = Message.find({
                room: room
            });
            let in_room;
            await Room.count({
                name: room.name,
                roomUsers: req.session.user
            }, function (err, count) {
                    if(err)
                        in_room = 0;
                    else
                        in_room = count;
            });
            res.render('room', {
                is_auth: req.session.is_auth,
                in_room: in_room,
                user: req.session.user,
                room: room,
                messages: messages
            });
        }
    });

});

router.get('/signin', function (req, res) {
    if (!req.session.is_auth)
        res.render('login', {
            is_auth: req.session.is_auth,
        });
    else
        res.redirect('/');
});

router.post('/signin', function (req, res, next) {
    let form = req.body;
    if (form.username && form.password) {
        User.authenticate(form.username, form.password, function (error, user) {
            if (error || !user) {
                const err = new Error('Wrong username or password');
                err.status = 401;
                return next(err);
            } else {
                req.session.user = user;
                req.session.is_auth = true;
                return res.redirect('/profile/' + user.username);
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
        res.render('registration', {
            is_auth: req.session.is_auth,
        });
    else
        req.redirect('/');
});

router.post('/signup', function (req, res, next) {
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
    req.session.user = null;
    res.redirect('/');
});

router.get('/profile/:username', function (req, res) {
    if (req.session.is_auth) {
        User.findOne({username: req.params.username}, function (err, user) {
            if (user) {
                res.render('profile', {
                        is_auth: req.session.is_auth,
                        user: req.session.user,
                        curUser: user,
                        room: req.session.room,
                    }
                );
            } else {
                res.send(404);
            }
        });
    } else {
        res.redirect('/signin');
    }
});

router.get('/create', function (req, res) {
    res.render('createroom', {
        is_auth: req.session.is_auth,
        user: req.session.user,
    });
});

router.post('/create', function (req, res) {
    let form = req.body;
    if (form.name && form.max_user) {
        Room.findOne({
            name: form.name,
            createdBy: req.session.user
        }, function (err, room) {
            if (room) {
                res.redirect('/create');
            } else if (err) {
                res.redirect('/create');
            } else {
                let data = {
                    name: form.name,
                    max_user: form.max_user,
                    createdBy: req.session.user
                };
                if (form.description)
                    data.description = form.description;
                Room.create(data, function (error, room) {
                    if (error) {
                        return next(error);
                    } else {
                        return res.redirect('/create');
                    }
                })
            }
        });
    } else {
        res.redirect('/create');
    }
});

module.exports = router;
