const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');
const userRouter = require('./routes/user');
const restRouter = require('./routes/restaurant');
const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.set('jwt-secret', config.secret);
app.use(cors());
app.get('/', (req, res) => {
  res.statusCode = 200;
  res.end('Hello over eats!');
});
app.use('/users', userRouter);
app.use('/restaurants', restRouter);
app.listen(8080, () => console.log('Listening on port 8080!'));

module.exports = app;
