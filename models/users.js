var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    ordered: Array
});

module.exports = mongoose.model('user', userSchema);