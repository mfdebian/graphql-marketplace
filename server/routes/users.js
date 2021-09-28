const bcrypt = require('bcrypt');

// request handler
module.exports = (app) => {
  const prisma = app.get('prisma');

  app.param('userId', (req, _, next, idString) => {
    if (req.auth?.user?.role !== 'admin') {
      return next(401);
    }
    // change id string to be Int instead of String
    let idInt = parseInt(idString);
    prisma.user.findUnique({
      where: { id: idInt }
    })
      .then(user => {
        if (!user) {
          return next(404);
        }
        // asign the received user to the 'user' attribute of req
        req.user = user;
        next();
      })
      .catch(next)
  });

  app.get('/users', (req, resp, next) => {
    if (!req.auth) {
      return next(401);
    }
    prisma.user.findMany({ orderBy: [{ id: 'asc' }] })
      .then(users => {
        resp.json(users);
      })
      .catch(next);
  });

  app.get('/users/:userId', (req, resp, next) => {
    resp.json(req.user);
  });

  app.post('/users', (req, resp, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(400);
    }

    bcrypt.hash(password, 10)
      .then(hash => prisma.user.create({
        data: { name, email, password: hash },
      }))
      .then(user => resp.json(user))
      .catch(next);
  });

  app.delete('/users/:userId', (req, resp, next) => {
    prisma.user.delete({
      where: { id: req.user.id }
    })
      .then(user => resp.json(user))
      .catch(next);
  });
}
