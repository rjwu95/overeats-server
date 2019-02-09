var mongoose = require('mongoose');
var reviews = require('./reviews');
var menus = require('./menus');

var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  name: { type: String, default: '구내식당' },
  address: { type: String, default: '성수동' },
  category: { type: String, default: '한식' },
  rating: { type: Number, default: null },
  menus: { type: Array, default: [exMenu] },
  reviews: { type: Array, default: [exReview] },
  numberOfOrder: { type: Number, default: 50 },
  thumbImg: {
    type: String,
    default:
      'https://codestates-im-10.slack.com/files/UF213BN07/FF9HNADK4/img_20190109_132202.jpg'
  }
});

var exReview = {
  name: '이그젬플',
  rating: '5',
  content: '맛있네요.',
  Date: { type: Date, default: Date.now }
};

var exMenu = {
  name: '동태찌개',
  price: 35000
};

module.exports = mongoose.model('restaurant', restaurantSchema);
