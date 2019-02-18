const jwt = require('jsonwebtoken');
const makeToken = require('../routes/makeToken');

module.exports.checkExpiredToken = (req, res, next) => {
  //read the token from the header or url
  const token = req.headers['x-access-token'] || req.query.token;

  // token does not exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in'
    });
  }

  //create a promise that decodes the token
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, req.app.get('jwt-secret'), (err, decode) => {
      if (err) reject(err);
      resolve(decode);
    });
  });
  //if it has failed to verify, it will return an error message
  const onError = error => {
    res.status(401).json({
      success: false,
      message: error.message
    });
  };

  //process the promise
  p.then(decode => {
    //pass the decode to next middleware
    req.decode = decode;
    next();
  }).catch(onError);
};

module.exports.checkTypeToken = async (req, res, next) => {
  let { type, ...user } = req.decode;
  const secret = req.app.get('jwt-secret');

  if (type === 'refresh') {
    let access = await makeToken(user, secret, 'access');
    res.set('access-token', access);
    res.end();
  }

  next();
};
