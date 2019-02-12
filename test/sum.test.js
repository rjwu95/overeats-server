const request = require('request');

test('check the sever is on', () => {
  request(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/',
    (err, res, body) => {
      expect(body).toBe('Hello over eats!');
    }
  );
});

test('check signup and signin', () => {
  //   request.post(
  //     'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signup',
  //     {
  //       json: {
  //         email: 'sello@gmail.com',
  //         password: '1234',
  //         name: 'test',
  //         phoneNumber: '010-7090-9090'
  //       }
  //     },
  //     function(error, response, body) {
  //       expect(response.statusCode).toBe(200);
  //       expect(body).toBe('nice to meet you');
  //     }
  //   );

  request.post(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signin/',
    {
      json: {
        email: 'xello@gmail.com',
        password: '1234'
      }
    },
    async function(error, response, body) {
      await expect(response.statusCode).toBe(200);
      await expect(body).toBe('Login!');
    }
  );
});

// test('check sign out', () => {
//   request.post(
//     'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signout',
//     {
//       json: {
//         email: 'xello@gmail.com',
//         phoneNumber: '010-8090-9090'
//       }
//     },
//     (err, res, body) => {
//       expect(res.statusCode).toBe(200);
//       // expect(body).toBe('ok');
//     }
//   );
// });

// test('check singin', () => {});
