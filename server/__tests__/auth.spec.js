const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { app } = require('../server');

describe('POST /auth', () => {
  beforeEach(() => {
    PrismaClient.mockClear();
  });

  it('should respond with 400 when no email or password', () => (
    request(app)
      .post('/auth')
      .then((response) => {
        expect(response.statusCode).toBe(400);
      })
  ));

  it('should respond 500 when db error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
    const prisma = Object.assign(new PrismaClient(), {
      user: {
        findUnique: jest.fn().mockRejectedValueOnce(new Error('OMG')),
      },
    });
    return request(app)
      .post('/auth')
      .send({ email: 'omg@omg.omg', password: 'secret' })
      .then((response) => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ statusCode: 500, message: 'OMG' });
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(500, 'OMG');
        expect(prisma.user.findUnique).toHaveBeenCalled();
        spy.mockRestore();
      });
  });

  it('should respond with 401 when user not found', () => {
    const prisma = Object.assign(new PrismaClient(), {
      user: { findUnique: jest.fn().mockResolvedValueOnce(null) },
    });
    return request(app)
      .post('/auth')
      .send({ email: 'omg@omg.omg', password: 'secret' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(prisma.user.findUnique).toHaveBeenCalled();
      });
  });

  it('should respond with 401 when password doesnt match', () => {
    const prisma = Object.assign(new PrismaClient(), {
      user: {
        findUnique: jest.fn().mockResolvedValueOnce({ password: 'omg' }),
      },
    });
    return request(app)
      .post('/auth')
      .send({ email: 'omg@omg.omg', password: 'secret' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          email: 'omg@omg.omg',
        });
      });
  });

  it('should respond with JWT (JSON Web Token) when credentials ok', () => {
    const prisma = Object.assign(new PrismaClient(), {
      user: {
        findUnique: jest.fn().mockResolvedValueOnce({
          password: '$2b$10$mSGC2MvbH73bDo1jEP5QHujuxhW0P7jHZDVzyc6rWgKj2gVSJTGz6',
        }),
      },
    });
    return request(app)
      .post('/auth')
      .send({ email: 'omg@omg.omg', password: 'secret' })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');
        expect(response.body.token.length).toBe(105);
        expect(prisma.user.findUnique).toHaveBeenCalled();
      });
  });
});
