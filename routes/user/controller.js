const bcrypt = require('bcrypt');
const User = require('../../models/users');
const jwt = require('jsonwebtoken');

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
          // generate jwt
          makeToken(user, secret).then(token => {
            // DON'T PUT STATUS CODE AND OBJECT TOGETHER IN writeHead
            // put token in header
            res.set('token', token);
            let restaurantKey = user.restaurantKey;
            restaurantKey
              ? res.end(JSON.stringify({ restaurantKey, message: 'ok' }))
              : res.status(200).send('okay');
          });
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
};

/* Sign Out*/
exports.signout = (req, res) => {
  const { email } = req.decode;
  // if token is valid, it will respond with its info
  User.deleteOne({ email }, async (err, user) => {
    console.log(user);
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.writeHead(200);
    res.end('ok');
  });
};

async function makeToken(user, secret) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber
      },
      secret,
      {
        expiresIn: '1h',
        issuer: 'overEats',
        subject: 'userInfo'
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
