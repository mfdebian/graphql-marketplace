const request = require('supertest');
const { app } = require('../server');

describe('GET /non-existent-path', () => {
  it('should respond with 404', () => (
    request(app)
      .get('/non-existent-path')
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ statusCode: 404, message: 'Not found' });
      })
  ));
});