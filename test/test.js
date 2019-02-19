const request = require('request');

test('check the sever is on', () => {
  request(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/',
    (err, res, body) => {
      expect(body).toBe('Hello over eats!');
    }
  );
});

test('check signup and signup', () => {
  request.post(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signup',
    {
      json: {
        email: 'vscode@gmail.com',
        password: '1234',
        name: 'test',
        phoneNumber: '010-7090-9090'
      }
    },
    function(error, response, body) {
      expect(body).toBe('nice to meet you');
    }
  );
});

test('check sing in', () => {
  request.post(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signin',
    {
      json: {
        email: 'vscode@gmail.com',
        password: '1234',
        name: 'test',
        phoneNumber: '010-7090-9090'
      }
    },
    (err, res, body) => {
      expect(Object.keys(res.headers)).toContain('refresh-token');
      expect(Object.keys(res.headers)).toContain('access-token');
      expect(body).toBe('okay');
    }
  );
});

test('check signout', () => {
  request.post(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signin',
    {
      json: {
        email: 'vscode@gmail.com',
        password: '1234',
        name: 'test',
        phoneNumber: '010-7090-9090'
      }
    },
    (err, res, body) => {
      request(
        `http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signout/?token=${
          res.headers['access-token']
        }`,
        function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(body).toBe('ok');
        }
      );
    }
  );
});
