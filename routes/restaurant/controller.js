const categoryList = require('../category');
const Restaurant = require('../../models/restaurant');
const jwt = require('jsonwebtoken');
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
  // Get token and socket io
  const token = req.headers['x-access-token'];
  let io = req.app.get('socketio');

  let { _id, restaurantName, orderList } = req.body;
  // token does not exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in'
    });
  }
  jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
    if (err) {
      // if it has failed to verify, it will return an error message
      return res.status(401).json({
        success: false,
        message: err.message
      });
    } else {
      // object that will store in user's database
      let orderObj = { restaurantName, orderList };
      // Get the phoneNumber of the person ordered
      const { phoneNumber } = decoded;
      // object that will send to restaurant

      // date Create
      let date = new Date();
      date = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      date = date + `${date.getDate()}일 ${date.getHours()}시`;
      date = date + `${date.getMinutes()}분`;
      // order_id Create
      let order_id = Number(String(Date.now()).slice(5));
      order_id = order_id + phoneNumber.slice(4, 8);

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
    }
  });
};

/* Finish delivery */
exports.delivery = (req, res) => {
  let io = req.app.get('socketio');
  let { order_id } = req.params;

  io.emit(order_id, req.body);
};
