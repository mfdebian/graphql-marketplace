const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { app } = require('../server');

describe('POST /users', () => {
  beforeEach(() => {
    PrismaClient.mockClear();
  });

  it('should respond with 400 when no password sent in body', () => {
    return request(app)
      .post('/users')
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  it('should invoke prisma.user.create and respond with 200 if ok', () => {
    const prisma = Object.assign(new PrismaClient(), {
      user: { create: jest.fn().mockResolvedValueOnce({}) },
    });
    return request(app)
      .post('/users')
      .send({ name: 'Foo', email: 'foo@bar.baz', password: 'secret' })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(prisma.user.create).toHaveBeenCalled();
        expect(prisma.user.create.mock.calls[0][0].data.name).toBe('Foo');
        expect(prisma.user.create.mock.calls[0][0].data.email).toBe('foo@bar.baz');
        expect(prisma.user.create.mock.calls[0][0].data.password.length).toBe(60);
      })
  });
});
