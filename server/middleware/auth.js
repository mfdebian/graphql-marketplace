const jwt = require('jsonwebtoken');

module.exports = (app) => {
  const prisma = app.get('prisma');
  const secret = app.get('jwtSecret');

  return (req, _, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return next();
    }

    const [type, token] = authorization.split(' ');

    if (type.toLowerCase() !== 'bearer') {
      return next();
    }

    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return next(401);
      }

      prisma.user.findUnique({ where: { id: decodedToken.uid } })
        .then((user) => {
          if (!user) {
            return next(401);
          }
          Object.assign(req, { auth: { token, decodedToken, user } });
          return next();
        })
        .catch(next);
    });
  };
};