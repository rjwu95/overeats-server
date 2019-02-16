const categoryList = require('../category');
const Restaurant = require('../../models/restaurant');
const User = require('../../models/users');

/* category & information */
exports.category = (req, res) => {
  let { category, address } = req.params;

  // find category.js
  category = categoryList[category];
  address = decodeURI(address);
  Restaurant.find({ category, address }, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.writeHead(200);
    res.end(JSON.stringify(data));
    return;
  });
};

/* Payment */
exports.payment = (req, res) => {
  // Get socket io
  let io = req.app.get('socketio');
  let { _id, restaurantName, orderList } = req.body;
  // object that will store in user's database
  let orderObj = { restaurantName, orderList };
  // Get the phoneNumber of the person who ordered
  const { phoneNumber } = req.decode;
  // date Create
  let date = new Date();
  date = `${date.getFullYear()}년 ${date.getMonth() +
    1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;

  // Create unique order_id
  let order_id = String(Date.now()).slice(5);
  order_id += phoneNumber.slice(4, 8);

  // object that will send to restaurant
  let restaurantObj = { phoneNumber, order_id, date, ...req.body };
  // if token is valid, insert data in user's database
  User.findOneAndUpdate(
    { phoneNumber },
    { $push: { ordered: orderObj } },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: err.message
        });
      }
      io.emit(_id, restaurantObj);
      res.end(JSON.stringify({ order_id }));
    }
  );
};

/* Finish delivery */
exports.delivery = (req, res) => {
  let io = req.app.get('socketio');
  let { order_id } = req.params;
  // req.params = restaurantKey, order_id
  io.emit(order_id, req.params);
  res.end();
};
