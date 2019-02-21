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
        return res.status(403).json({
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

// 클라이언트에서 별점, 코멘트, 토큰,레스토랑키를 받고 유저정보를 디비에서
//확인하고, 레스토랑 디비에 유저이메일 앞부분과 별점,코멘트, 시간을 넣어준다.
exports.review = (req, res) => {
  let { rating, content, restaurantKey } = req.body;
  //바디가 비어있을경우

  if (rating === undefined || content === undefined) {
    res.status(400).end();
  }
  // token does not exist

  // Get the email of the person ordered
  const { email } = req.decode;

  // function emailIsValid (email) {
  //return /\S+@\S+\.\S+/.test(email)
  //}

  // 정규표현식으로 이메일네임부분 잘라내기
  let i = /\S+@/.exec(email);
  let name = i[0].slice(0, i.length - 2);
  let review = { name, rating, content };
  // 레스토랑 DB에 리뷰 넣기

  Restaurant.findOneAndUpdate(
    { _id: restaurantKey },
    { $push: { reviews: review } },
    { new: true },
    (err, doc) => {
      let { rating, numberOfOrder } = doc;
      let averageRating =
        (rating * numberOfOrder + review.rating) / (numberOfOrder + 1);

      // 레스토랑 디비의 평점남기기
      Restaurant.findOneAndUpdate(
        { _id: restaurantKey },
        {
          $set: {
            rating: averageRating,
            numberOfOrder: numberOfOrder + 1
          }
        },
        { new: true },
        (err, doc) => {
          if (err) {
            return res.status(403).json({
              success: false,
              message: err.message
            });
          }
          res.status(200).json('ok');
        }
      );
    }
  );
};
