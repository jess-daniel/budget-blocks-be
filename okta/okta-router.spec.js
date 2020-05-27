const request = require('supertest');
const server = require('../server');
const db = require('../data/db-config');

describe('OKTA ROUTER', () => {
  describe('GET /users - all users', () => {
    it('should return 200', () => {
      return request(server)
        .get('/api/users/')
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it('returns an array of objects of users', () => {
      const expected = [
        {
          id: 1,
          name: 'Edward Blanciak',
          email: 'budgetblocks@gmail.com',
        },
        {
          id: 2,
          name: 'Mike',
          email: 'blah2@blah.com',
        },
      ];

      return request(server)
        .get('/api/users/')
        .then((res) => {
          expect(res.body.data).toEqual(expected);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  });

  it('POST /users - add user', () => {});

  it('DELETE /users - delete user', () => {});
});
