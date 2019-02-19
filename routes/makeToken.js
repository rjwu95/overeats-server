import { sign } from 'jsonwebtoken';

async function makeToken(user, secret, type) {
  let time = '3h';
  if (type === 'refresh') {
    time = '14d';
  }
  return new Promise((resolve, reject) => {
    sign(
      {
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        type
      },
      secret,
      {
        expiresIn: time,
        issuer: 'overEats',
        subject: 'userInfo'
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

export default makeToken;
