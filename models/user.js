const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    _id: {
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (password) {
                if (password.length < 8)
                    return false;
                else if (!password.match(/\d+/))
                    return false;
            },
            message: 'This password is too weak'
        }
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({username: username})
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                let err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
};

UserSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

let User = mongoose.model('User', UserSchema);
module.exports = User;