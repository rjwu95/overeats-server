const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user');
const menuRouter = require('./routes/menu');
const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.end('Hello over eats!');
});
app.use('/users', userRouter);
app.use('/menus', menuRouter);
app.listen(8080, () => console.log('Listening on port 8080!'));

module.exports = app;
