var mongoose = require('mongoose');
var menuSchema = require('./menus').menuSchema;
var reviewSchema = require('./reviews').reviewSchema;

var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  name: String,
  address: String,
  category: String,
  rating: { type: Number, default: 3.5 },
  menus: [new Schema(menuSchema)],
  reviews: [new Schema(reviewSchema)],
  numberOfOrder: { type: Number, default: 50 },
  thumbImg: String
});
module.exports = mongoose.model('restaurant', restaurantSchema);
