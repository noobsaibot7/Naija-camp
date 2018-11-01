var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var userSkema = new mongoose.Schema({
    username: String,
    password: String
});

userSkema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSkema);
