var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
  ordered: Array,
  restaurantKey: { type: String, default: null },
  refreshToken: String
});

// find one user by using username
userSchema.statics.findOneByEmail = function(email) {
  return this.findOne({ email }).exec();
};
module.exports = mongoose.model('User', userSchema);
