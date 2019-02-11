const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/users');

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
    let { email, password } = req.body;
    User.find({ email }, async (err, user) => {
      // if email is exist
      if (user.length > 0) {
        // check the password match
        await bcrypt.compare(password, user[0].password, (err, bool) => {
          if (err) return console.log(err);
          if (bool) {
            // if password is correct
            res.writeHead(200);
            res.end('Login!');
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

/* Sign Info */
router.post('/signinfo', (req, res) => {
  //connect with database
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', function() {
    let { email } = req.body;
    User.find({ email }, async (err, user) => {
      // if email is exist
      if (user.length > 0) {
        let { name, email, phoneNumber, ordered } = user[0];
        console.log(user);
        res.end(JSON.stringify({ name, email, phoneNumber, ordered }));
      } else {
        //if email is non-exist
        res.writeHead(401);
        res.end('Please login info');
        return;
      }
    });
  });
});
module.exports = router;
