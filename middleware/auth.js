const jwt = require('jsonwebtoken');

module.exports.checkToken = (req, res, next) => {
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
      message: err.message
    });
  };

  //process the promise
  p.then(decode => {
    //pass the decode to next middleware
    req.decode = decode;
    next();
  }).catch(onError);
};
