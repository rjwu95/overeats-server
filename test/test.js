const request = require('request');

test('check the sever is on', done => {
  request(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/',
    (err, res, body) => {
      expect(body).toBe('Hello over eats!');
      done();
    }
  );
});

test('check signup', done => {
  request.post(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signup',
    {
      json: {
        email: 'qwerty@gmail.com',
        password: '1234',
        name: 'test',
        phoneNumber: '010-7090-1212'
      }
    },
    function(error, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body).toBe('nice to meet you');
      done();
    }
  );
});

test('check sign in', done => {
  request.post(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signin',
    {
      json: {
        email: 'qwerty@gmail.com',
        password: '1234'
      }
    },
    (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(Object.keys(res.headers)).toContain('refresh-token');
      expect(Object.keys(res.headers)).toContain('access-token');
      expect(body).toBe('okay');
      done();
    }
  );
});

test('check signout', done => {
  request.post(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signin',
    {
      json: {
        email: 'qwerty@gmail.com',
        password: '1234'
      }
    },
    (err, res, body) => {
      request(
        `http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signout/?token=${
          res.headers['access-token']
        }`,
        (error, response, body) => {
          expect(response.statusCode).toBe(200);
          expect(body).toBe('ok');
          done();
        }
      );
      done();
    }
  );
});
