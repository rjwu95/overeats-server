/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

/* =======================
    LOAD THE CONFIG
==========================*/
const config = require('./config');
const port = process.env.PORT || 8080;

/* =======================
    LOAD THE ROUTER
==========================*/
const userRouter = require('./routes/user/');
const restRouter = require('./routes/restaurant');

/* =======================
    EXPRESS CONFIGURATION
==========================*/
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// set the secret key variable for jwt
app.set('jwt-secret', config.secret);
// handle cors error
app.use(cors());

// index page, just for testing
app.get('/', (req, res) => {
  res.end('Hello over eats!');
});

// configure api router
app.use('/users', userRouter);
app.use('/restaurants', restRouter);

app.listen(port, () => console.log(`Listening on port ${port}!`));

/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('connected to mongodb server');
});
