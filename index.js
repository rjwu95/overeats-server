const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user');

const app = express();

// app.use(express.static('dist'));
app.use(bodyParser.json());

app.use('/users', userRouter);

app.listen(8080, () => console.log('Listening on port 8080!'));

module.exports = app;
