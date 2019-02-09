var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var menuSchema = new Schema({
  name: String,
  price: Number
});

module.exports = mongoose.model('menus', menuSchema);
