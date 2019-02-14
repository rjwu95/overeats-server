const categoryList = require('../category');
const Restaurant = require('../../models/restaurant');
const jwt = require('jsonwebtoken');

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
  const token = req.headers['x-access-token'] || req.query.token;
  const order_id = 200712344578;
  const date = new Date(new Date().getTime()).toString();
  //식당ID, 주문내역 ={ 주문메뉴,주문개수,주문가격}
  let { _id, ordered } = req.body;
  io.emit(_id, {
    phoneNumber,
    ordered,
    name,
    order_id,
    date
  });
  res.end(JSON.stringify({ order_id, ordered, date }));
};

/* Finish delivery */
exports.delivery = (req, res) => {};
