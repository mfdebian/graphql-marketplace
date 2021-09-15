const bcrypt = require('bcrypt');

// request handler
module.exports = (app) => {
  const prisma = app.get('prisma');
  app.param('userId', (req, res, next, idString) => {
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

  app.get('/users', (request, response, next) => {
    prisma.user.findMany({ orderBy: [{ id: 'asc' }] })
      .then(users => {
        response.json(users);
      })
      .catch(next);
  });

  app.get('/users/:userId', (req, res, next) => {
    res.json(req.user);
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

  app.delete('/users/:userId', (req, res, next) => {
    prisma.user.delete({
      where: { id: req.user.id }
    })
      .then(user => res.json(user))
      .catch(next);
  });
}
