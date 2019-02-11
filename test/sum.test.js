const request = require('request');

let testURI = 'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/';

test('check the sever is on', () => {
  request(testURI, (err, res, body) => {
    expect(body).toBe('Hello over eats!');
  });
});

test('check signup and signin', () => {
  request.post(
    testURI + 'users/signup',
    {
      json: {
        email: 'hello@gmail.com',
        password: '1234',
        name: 'test',
        phoneNumber: '010-9090-9090'
      }
    },
    function(error, response, body) {
      expect(response.statusCode).toBe(200);
      expect(body).toBe('nice to meet you');
    }
  );

  request.post(
    testURI + 'users/signin/',
    {
      json: {
        email: 'hello@gmail.com',
        password: '1234'
      }
    },
    function(error, response, body) {
      expect(response.statusCode).toBe(200);
      expect(body).toBe('Login!');
    }
  );
});

// test('check singin', () => {});
