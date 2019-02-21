const request = require('request');

describe('user test', () => {
  const user = {
    json: {
      email: 'qwerty@gmail.com',
      password: '1234',
      name: 'test',
      phoneNumber: '010-7090-1212'
    }
  };
  const url = 'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/';

  test('check the sever is on', done => {
    request(url, (err, res, body) => {
      expect(body).toBe('Hello over eats!');
      done();
    });
  });
  test('check signup', done => {
    request.post(`${url}users/signup`, user, function(error, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body).toBe('nice to meet you');
      done();
    });
  });

  test('check sign in', done => {
    request.post(`${url}users/signin`, user, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(Object.keys(res.headers)).toContain('refresh-token');
      expect(Object.keys(res.headers)).toContain('access-token');
      expect(body).toBe('okay');
      done();
    });
  });

  test('check info', done => {
    let checkBody = {
      email: 'qwerty@gmail.com',
      name: 'test',
      ordered: [],
      phoneNumber: '010-7090-1212'
    };
    request.post(`${url}users/signin`, user, (err, res, body) => {
      request(
        `${url}users/info/?token=${res.headers['access-token']}`,
        (error, response, body) => {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(body)).toEqual(checkBody);
          done();
        }
      );
      done();
    });
  });

  test('check signout', done => {
    request.post(`${url}users/signin`, user, (err, res, body) => {
      request(
        `${url}users/signout/?token=${res.headers['access-token']}`,
        (error, response, body) => {
          expect(response.statusCode).toBe(200);
          expect(body).toBe('ok');
          done();
        }
      );
      done();
    });
  });
});

describe('restaurant test', () => {
  it('check category in DB', done => {
    request(
      'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/restaurants/korean/%EC%A2%85%EB%A1%9C%EA%B5%AC',
      (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body.length).not.toBe(0);
        done();
      }
    );
  });
});
