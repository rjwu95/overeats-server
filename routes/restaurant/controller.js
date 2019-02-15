const categoryList = require('../category');
const Restaurant = require('../../models/restaurant');

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
  const token = req.headers['x-access-token'];
  //식당ID, 주문내역 ={ 주문메뉴,주문개수,주문가격}
  let { _id, ordered } = req.body;
  let io = req.app.get('socketio');

  jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
    if (err) {
      // if it has failed to verify, it will return an error message
      return res.status(401).json({
        success: false,
        message: err.message
      });
    } else {
      const { email, phoneNumber } = decoded;
      let date = new Date();
      date = `${date.getFullYear()}년 ${date.getMonth() +
        1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
      const order_id =
        Number(String(Date.now()).slice(5)) + phoneNumber.slice(4, 8);
      // if token is valid, it will respond with its info
      User.find({ email }, async (err, user) => {
        // if email is exist
        if (user.length > 0) {
          //update user
          let { phoneNumber, name } = user[0];
          io.emit(_id, {
            phoneNumber,
            ordered,
            name,
            order_id,
            date
          });
          res.end(JSON.stringify({ order_id, ordered, date }));
        } else {
          //if email is non-exist
          res.writeHead(401);
          res.end('Please login info');
          return;
        }
      });
    }
  });
};

/* Finish delivery */
exports.delivery = (req, res) => {};
