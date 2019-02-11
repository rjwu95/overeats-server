const Restaurant = require('../models/restaurant');
const categoryList = require('./category');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/:category/:address', (req, res) => {
  let { category, address } = req.params;
  // find category.js
  category = categoryList[category];
  address = decodeURI(address);
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', () => {
    console.log('we are connected!');
    //check there's same category

    Restaurant.find({ category, address }, (err, rest) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.writeHead(200);
      res.end(JSON.stringify(rest));
      return;
    });
  });
});
module.exports = router;
