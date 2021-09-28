const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { app } = require('../server');

describe('GET /users', () => {
  beforeEach(() => {
    PrismaClient.mockClear();
    jwt.verify.mockClear();
  });

  it('should respond with 401 when no auth', () => (
    request(app)
      .get('/users')
      .then((response) => {
        expect(response.statusCode).toBe(401);
      })
  ));

  it('should respond with 401 when token is not of type Bearer', () => (
    request(app)
      .get('/users')
      .auth('my_token', { type: 'basic' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
      })
  ));

  it('should respond with 401 when token can not be verified', () => (
    request(app)
      .get('/users')
      .auth('my_token', { type: 'bearer' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(jwt.verify.mock.calls[0][0]).toBe('my_token');
        expect(jwt.verify.mock.calls[0][1]).toBe('super-secret');
      })
  ));

  it('should respond with 401 when auth user not found', () => {
    jwt.verify.mockImplementationOnce((_, __, cb) => cb(null, {}));
    const prisma = Object.assign(new PrismaClient(), {
      user: { findUnique: jest.fn().mockResolvedValueOnce(null) },
    });
    return request(app)
      .get('/users')
      .auth('my_token', { type: 'bearer' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      });
  });

  it('should respond with users list when auth ok', () => {
    jwt.verify.mockImplementationOnce((_, __, cb) => cb(null, {}));
    const prisma = Object.assign(new PrismaClient(), {
      user: {
        findUnique: jest.fn().mockResolvedValueOnce({ uid: 1 }),
        findMany: jest.fn().mockResolvedValueOnce([
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' },
          { id: 3, name: 'baz' },
        ]),
      },
    });
    return request(app)
      .get('/users')
      .auth('my_token', { type: 'bearer' })
      .then((response) => {
        expect(response.body).toEqual([
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' },
          { id: 3, name: 'baz' },
        ]);
        expect(response.statusCode).toBe(200);
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      });
  });
});

describe('GET /users/:userId', () => {
  beforeEach(() => {
    // const prisma = new PrismaClient();
    // prisma.user.findUnique.mockClear();
    PrismaClient.mockClear();
  });

  it('should respond with 401 when no auth', () => (
    request(app)
      .get('/users/1')
      .then((response) => {
        expect(response.statusCode).toBe(401);
      })
  ));

  it('should respond with 401 when not admin or self', () => {
    jwt.verify.mockImplementationOnce((_, __, cb) => cb(null, { uid: 1 }));
    const prisma = Object.assign(new PrismaClient(), {
      user: { findUnique: jest.fn().mockResolvedValueOnce({ id: 1 }) },
    });
    return request(app)
      .get('/users/1')
      .auth('my_token', { type: 'bearer' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
      });
  });

  it('should respond with 404 when not found', () => {
    jwt.verify.mockImplementationOnce((_, __, cb) => cb(null, { uid: 1 }));
    const prisma = Object.assign(new PrismaClient(), {
      user: {
        findUnique: jest.fn().mockImplementation(({ where }) => Promise.resolve(
          where.id === 1
            ? { id: 1, role: 'admin' }
            : null
        )),
      },
    });
    return request(app)
      .get('/users/2')
      .auth('my_token', { type: 'bearer' })
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });

  it('should respond with user when admin', () => {
    jwt.verify.mockImplementationOnce((_, __, cb) => cb(null, { uid: 1 }));
    const prisma = Object.assign(new PrismaClient(), {
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: 1, role: 'admin' }),
      },
    });
    return request(app)
      .get('/users/1')
      .auth('my_token', { type: 'bearer' })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ id: 1, role: 'admin' });
      });
  });
});

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
