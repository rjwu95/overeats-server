const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const router = express.Router();

/* Sign In */
router.post('/signin', (req, res) => {
  //connect with database
	
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', function() {
    console.log('we are connect!');
    const { email, password } = req.body;
	  console.log(email)
    const secret = req.app.get('jwt-secret');

    User.find({ email }, async (err, user) => {
      // if email is exist
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
                username: user[0].email
              },
              secret,
              {
                expiresIn: '10m',
                issuer: 'overEats',
                subject: 'userInfo'
              },
              (err, token) => {
                if (err) console.log(err);
                res.writeHead(200,{token});
                res.end('ok');

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
  });
});

/* Sign Up */
// generate token
router.post('/signup', (req, res) => {
  //connect with database
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', function() {
    console.log('we are connected!');
    //check there's same phoneNumber
    User.find({ phoneNumber: req.body.phoneNumber }, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      //already has ID with phoneNumber
      if (user.length !== 0) {
        res.status(401);
        res.end('already has ID with phoneNumber');
        return;
      } else {
        //check there's same email
        User.find({ email: req.body.email }, async (err, user) => {
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
            let { name, email, password, phoneNumber } = req.body;
            //hasing the password
            await bcrypt.hash(password, 10, (err, hash) => {
              if (err) return console.log(err);
              password = hash;
              User.create({ name, email, password, phoneNumber });
            });
            res.writeHead(200);
            res.end('nice to meet you');
            return;
          }
        });
      }
    });
  });
});

/* Sign Out*/
router.post('/signout', (req, res) => {
  //connect with database
  let { email, phoneNumber } = req.body;
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', function() {
    console.log('we are connected!');
    //check there's same phoneNumber
    // User.remove({ email, phoneNumber }, (err, user) => {
    //   if (err) {
    //     return res.status(500).json({ error: err });
    //   }
    // });
    res.writeHead(200);
    res.end('ok');
  });
});

/* Info */
router.post('/signinfo', (req, res) => {
  //connect with database
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', function() {
    const token = req.headers['x-access-token'] || req.query.token;
    // token does not exist
    if (!token) {
      return res.status(403).end(
        JSON.stringify({
          success: false,
          message: 'not logged in'
        })
      );
    }

    jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
      if (err) {
        // if it has failed to verify, it will return an error message
        res.status(403).json({
          success: false,
          message: err.message
        });
      } else {
        // if token is valid, it will respond with its info
        User.find({ email: decoded.username }, async (err, user) => {
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
  });
});

/* Sign Out*/
router.post('/signout', (req, res) => {
  //connect with database
  let { email, phoneNumber } = req.body;
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', function() {
    console.log('we are connected!');
    //check there's same phoneNumber
    User.remove({ email, phoneNumber }, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.writeHead(200);
      res.end('ok');
    });
  });
});

// var cors = {
//   'access-control-allow-origin': '*',
//   'access-control-max-age': 10 // Seconds.
// };
module.exports = router;
