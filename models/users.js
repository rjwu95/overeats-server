var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
  ordered: Array,
  restaurantKey: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
