const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

var UserModel = mongoose.model('Users', UserSchema);

module.exports = { Users: UserModel }