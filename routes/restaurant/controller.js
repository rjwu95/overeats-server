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
      date = `${date.getFullYear()}년 ${date.getMonth() +
        1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
      // unique order_id Create
      let order_id = String(Date.now()).slice(5);
      order_id += phoneNumber.slice(4, 8);

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
  // req.params = restaurantKey, order_id
  io.emit(order_id, req.params);
  res.end();
};

// 클라이언트에서 별점, 코멘트, 토큰,레스토랑키를 받고 유저정보를 디비에서
//확인하고, 레스토랑 디비에 유저이메일 앞부분과 별점,코멘트, 시간을 넣어준다.
exports.review = (req, res) => {
  const token = req.headers['x-access-token'];
  let { rating, content } = req.body;
  //바디가 비어있을경우
  if (!!rating || !!content) {
    res.status(500).end();
    return;
  }
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
      // Get the phoneNumber of the person ordered
      const { phoneNumber } = decoded;

      // if token is valid, insert data in user's database
      User.find({ phoneNumber }, (err, user) => {
        // if email is exist
        if (user.length > 0) {
          // function emailIsValid (email) {
          //return /\S+@\S+\.\S+/.test(email)
          //}

          let { email, restaurantKey } = user[0];
          // 정규표현식으로 이메일네임부분 잘라내기
          let i = /\S+@/.exec(email);
          let name = i[0].slice(0, i.length - 2);

          let review = { name, rating, content };
          // 레스토랑 DB에 리뷰 넣기
          Restaurant.findOneAndUpdate(
            { restaurantKey },
            { $push: { reviews: review } },
            { new: true },
            (err, doc) => {
              let { rating, numberOfOrder } = doc;
              let averageRating =
                (rating * numberOfOrder + review.rating) / (numberOfOrder + 1);

              // 레스토랑 디비의 평점남기기
              Restaurant.findOneAndUpdate(
                { restaurantKey },
                {
                  $set: {
                    rating: averageRating,
                    numberOfOrder: numberOfOrder + 1
                  }
                },
                { new: true },
                (err, doc) => {
                  if (err) {
                    return res.status(401).json({
                      success: false,
                      message: err.message
                    });
                  }
                  res.status(200).json('ok');
                }
              );
            }
          );
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
