/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const app = require('express')();
const bodyParser = require('body-parser');
const server = app.listen(process.env.PORT || 8080);
const mongoose = require('mongoose');
var io = require('socket.io')(server);
const cors = require('cors');

/* =======================
    LOAD THE CONFIG
==========================*/
//must be in git ignore!!
const config = require('./config.json');

/* =======================
    LOAD THE ROUTER
==========================*/
const userRouter = require('./routes/user/');
const restRouter = require('./routes/restaurant');

// parse JSON and url-encoded query
// if extended is true, it can bring nested object successfully
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the secret key variable for jwt
app.set('jwt-secret', config.secret);
// set the io
app.set('socketio', io);
// handle cors error
app.use(cors());

// index page, just for testing
app.get('/', (req, res) => {
  res.send('Hello over eats!');
});

// configure api router
app.use('/users', userRouter);
app.use('/restaurants', restRouter);

io.on('connection', socket => {
  console.log('connected to socket io');
});
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
