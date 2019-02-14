const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/users');

/* Sign In */
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const secret = req.app.get('jwt-secret');
  User.find({ email }, async (err, user) => {
    // if email is exist
    let restaurantKey;
    if (!!user[0]) {
      restaurantKey = user[0].restaurantKey;
    }
    if (user.length > 0) {
      // check the password match
      await bcrypt.compare(password, user[0].password, async (err, bool) => {
        if (err) return console.log(err);
        if (bool) {
          // if password is correct
          // generate jwt
          await jwt.sign(
            {
              _id: user[0]._id,
              email: user[0].email
            },
            secret,
            {
		    expiresIn: '1h',
              issuer: 'overEats',
              subject: 'userInfo'
            },
            (err, token) => {
              if (err) console.log(err);
              res.writeHead(200, { token });
              restaurantKey !== null
                ? res.end(JSON.stringify({ restaurantKey, message: 'ok' }))
                : res.end('ok');
            }
          );
        } else {
          // if password is wrong
          res.writeHead(401);
          res.end('Please check your email or password');
          return;
        }
      });
    } else {
      //if email is non-exist
      res.writeHead(401);
      res.end('Please check your email or password');
      return;
    }
  });
};

/* Sign Up */
exports.signup = (req, res) => {
  let { name, email, password, phoneNumber, restaurantKey } = req.body;
  //check there's same phoneNumber
  User.find({ phoneNumber }, async (err, user) => {
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

/* Info */
exports.info = (req, res) => {
  const token = req.headers['x-access-token'] || req.query.token;
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
      const { email } = decoded;
      // if token is valid, it will respond with its info
      User.find({ email }, async (err, user) => {
        // if email is exist
        if (user.length > 0) {
          let { name, email, phoneNumber, ordered } = user[0];
          res.end(JSON.stringify({ name, email, phoneNumber, ordered }));
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

/* Sign Out*/
exports.signout = (req, res) => {
  const token = req.headers['x-access-token'] || req.query.token;
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
      const { email } = decoded;
      // if token is valid, it will respond with its info
      User.deleteOne({ email }, async (err, user) => {
        console.log(user);
        if (err) {
          return res.status(500).json({ error: err });
        }
        res.writeHead(200);
        res.end('ok');
      });
    }
  });
};
