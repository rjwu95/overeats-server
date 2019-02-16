const jwt = require('jsonwebtoken');

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

module.exports.checkTypeToken = (req, res, next) => {
  let { type } = req.decode;

  if (type === 'refresh') {
  }
};

// 1. 클라이언트가 토큰을 요청한다
// 2. 토큰이 유효한지 아닌지 체크한다 (checkExpiredToken)

// 3-1. 유효한 경우, 토큰의 타입을 확인한다 (checkTypeToken)
//access인 경우, 넘어간다...
//refresh인 경우, access토큰을 생성하고 넘어간다

// 3-2. 유효하지 않은 경우, 타입을 확인한다 (checkTypeToken)
//access인 경우, 만료되었다고 알려준다
//refresh인 경우, 로그인하라고 알려준다!

// 4. controller를 실행한다
