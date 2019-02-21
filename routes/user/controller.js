const bcrypt = require('bcrypt');
const User = require('../../models/users');
const makeToken = require('../makeToken');
const Restaurant = require('../../models/restaurant');

/* Sign Up */
exports.signup = (req, res) => {
  let { name, email, password, phoneNumber, restaurantKey } = req.body;
  //check there's same phoneNumber
  User.find({ phoneNumber }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    //already has ID with phoneNumber
    if (user.length > 0) {
      res.status(401);
      res.end('already has ID with phoneNumber');
      return;
    } else {
      //check there's same email
      User.find({ email }, async (err, user) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        //already exist same ID
        if (user.length > 0) {
          res.status(402);
          res.end('already exist same ID');
          return;
        } else {
          //go to sign up
          //hasing the password
          await bcrypt.hash(password, 10, (err, hash) => {
            if (err) return console.log(err);
            password = hash;
            User.create({ name, email, password, phoneNumber, restaurantKey });
          });
          res.writeHead(200);
          res.end('nice to meet you');
          return;
        }
      });
    }
  });
};

/* Sign In */
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const secret = req.app.get('jwt-secret');

  User.findOneByEmail(email).then(async user => {
    // if email is exist
    if (user) {
      // check the password match
      await bcrypt.compare(password, user.password, async (err, bool) => {
        if (err) return console.log(err);
        if (bool) {
          // if password is correct
          // generate access token
          let access = await makeToken(user, secret, 'access');
          let refresh = await makeToken(user, secret, 'refresh');
          // DON'T PUT STATUS CODE AND OBJECT TOGETHER IN writeHead
          // put token in header
          res.set('access-token', access);
          res.set('refresh-token', refresh);

          User.findOneAndUpdate(
            { email: user.email },
            { $set: { refreshToken: refresh } },
            { new: true },
            (err, doc) => {
              if (err) {
                return res.status(401).json({
                  success: false,
                  message: err.message
                });
              }

              let restaurantKey = user.restaurantKey;
              if (restaurantKey) {
                Restaurant.findOne({ _id: restaurantKey }, (err, doc) => {
                  res.end(JSON.stringify({ restaurantKey, name: doc.name }));
                });
              } else {
                res.status(200).send('okay');
              }
            }
          );
        } else {
          // if password is wrong
          res.writeHead(401);
          res.send('Please check your email or password');
          return;
        }
      });
    } else {
      //if email is non-exist
      res.status(401).send('Please check your email or password');
      return;
    }
  });
};

/* Info */
exports.info = (req, res) => {
  const { email } = req.decode;
  // if token is valid, it will respond with its info
  User.find({ email }, (err, user) => {
    // if email is exist
    if (user.length > 0) {
      let { name, email, phoneNumber, ordered } = user[0];
      res.end(JSON.stringify({ name, email, phoneNumber, ordered }));
    } else {
      //if email is non-exist
      res.writeHead(401);
      res.end('Please login info');
    }
  });
};

/* Sign Out*/
exports.signout = (req, res) => {
  const { email } = req.decode;
  // if token is valid, it will respond with its info
  User.deleteOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.writeHead(200);
    res.end('ok');
  });
};
