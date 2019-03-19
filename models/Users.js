const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '${VALUE} is not valid'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

})
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                //console.log('Hashed Password: ' + hash)
                console.log('Saving with password modify')
                next();
            })
        })
    }
    else {
        console.log('Saving without password modify')
        next();
    }
})
UserSchema.methods.genAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: this._id.toHexString(), access },
        'secret').toString();
    user.tokens = user.tokens.concat([{ access, token }]);
    //user.tokens.push({ access, token });
    return user.save().then(() => token);
}
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email'])
}
UserSchema.statics.findByToken = function (token) {
    var user = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'secret');
        if (!decoded._id)
            throw ('decoded null');
    }
    catch (e) {
        return Promise.reject('Error while decoding ' + e);
    }
    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }).then((user) => {
        if (!user)
            return Promise.reject('No user found with token');
        //console.log('User found with given Token: ' + user + '\n===============================');
        return user;
    })

}
UserSchema.statics.getHashPassword = function (email) {
    var user = this;
    return user.findOne({ email })
        .then(user => {
            if (!user)
                return Promise.reject('No user found with email');
            //console.log(user)
            return user;
        })
}
var UserModel = mongoose.model('Users', UserSchema);

module.exports = { Users: UserModel }