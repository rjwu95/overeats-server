const express = require('express');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/users.js');
// const path = require('path');
// const publicPath = path.join(__dirname, '../client/')

// app.use(express.static(publicPath));
const app = express();
app.use(bodyParser.json());


var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

// //로그인
app.post('/users/signin', (req, res) => {
    mongoose.connect('mongodb://127.0.0.1:27017/mongodb_tutorial', { useNewUrlParser: true })
    User.find({ email: req.body.email }, (err, user) => {
        //유저정보
        // console.log(user[0]);
        if (user.length !== 0) {
            bcrypt.compare(req.body.password, user[0].password, (err, bool) => {
                if (err) return console.log(err);
                if (bool) {
                    console.log('로그인');
                    res.writeHead(200);
                    res.end('로그인');
                } else {
                    console.log('비밀번호틀림');
                    res.writeHead(401);
                    res.end('아이디와 비밀번호를 확인해주세요');
                }
            })
        } else {
            console.log('이메일틀림');
            res.writeHead(401);
            res.end('아이디와 비밀번호를 확인해주세요');
        }
    });
});


// //회원가입
app.post('/users/signup', (req, res) => {
    mongoose.connect('mongodb://127.0.0.1:27017/mongodb_tutorial', { useNewUrlParser: true });
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        User.find({ phoneNumber: req.body.phoneNumber, email: req.body.email }, (err, users) => {
            if (err) return res.status(500).json({ error: err });
            if (users.length === 0) {
                var user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.password = hash;
                user.phoneNumber = req.body.phoneNumber;
                user.ordered = [];
                user.save((err) => {
                    if (err) {
                        console.error(err);
                        console.log('아이디 중복됨!');
                        res.writeHead(401);
                        res.json({ result: 0 });
                        res.end('아이디 중복!!');
                        return;
                    }
                    console.log('회원가입됨!');
                    res.writeHead(200);
                    res.end('회원가입');
                    return;
                });
                console.log(user);
            } else {
                console.log('아이디 중복됨!');
                res.writeHead(401);
                res.end('아이디 중복!!');
                return;
            }
        })
    });

});

app.listen(3000, () => {
    console.log('listening......');
});