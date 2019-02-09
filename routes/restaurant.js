const Restaurant = require('../models/restaurant');

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
router.get('/:category', (req, res) => {
  let { category } = req.params;
  mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
    useNewUrlParser: true
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // if connection is success
  db.once('open', function() {
    console.log('we are connected!');
    //check there's same category
    Restaurant.find({ category: req.body.category }, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      switch (category) {
        case '한식':
          break;
        case '분식':
          break;
        case '돈까스,회,일식':
          break;
        case '치킨':
          break;
        case '피자':
          break;
        case '도시락':
          break;
        case '족발,보쌈':
          break;
        case '야식':
          break;
        case '중국집':
          break;
        case '찜,탕':
          break;
        case '카페,디저트':
          break;
        case '패스트푸드':
          break;
        case '세계음식':
          break;
      }
    });
  });
});

module.exports = router;
