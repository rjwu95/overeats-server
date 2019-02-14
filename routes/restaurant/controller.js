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
  let { _id, address, orderList } = req.body;

  let io = req.app.get('socketio');
  io.emit(_id, { address, orderList });
  res.end('ok');
};
