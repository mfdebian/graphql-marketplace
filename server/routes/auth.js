const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
  const prisma = app.get('prisma');
  const secret = app.get('jwtSecret');

  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    try {
      const user = await prisma.user.findUnique({ email });
      if (!user) {
        return next(401);
      }
      const result = await bcrypt.compare(password, user.password);
      if (result !== true) {
        return next(401);
      }
      resp.json({ token: jwt.sign({ uid: user.id }, secret) });
    } catch (err) {
      next(err);
    }
  });
};