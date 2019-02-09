var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
  name: String,
  rating: Number,
  content: String,
  Date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
