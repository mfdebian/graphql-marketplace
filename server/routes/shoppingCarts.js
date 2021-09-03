// request handler
module.exports = (app) => {
  const prisma = app.get('prisma');
  app.param('shoppingCartId', (req, res, next, idString) => {
    // change id string to be Int instead of String
    let idInt = parseInt(idString);
    prisma.shoppingCart.findUnique({
      where: {id: idInt}
    })
      .then(shoppingCart => {
        if(!shoppingCart) {
          return next(404);
        }
        // asign the received shoppingCart to the 'shoppingCart' attribute of req
        req.shoppingCart = shoppingCart;
        next();
      })
      .catch(next)
  });

  app.get('/shoppingCarts', (request, response, next) => {
    prisma.shoppingCart.findMany({orderBy: [{id: 'asc'}],
      include: {
        products: true,
      }
    })
      .then(shoppingCarts => {
        response.json(shoppingCarts);
      })
      .catch(next);
  });

  app.get('/shoppingCarts/:shoppingCartId', (req, res, next) => {
    res.json(req.shoppingCart);
  });

  app.post('/shoppingCarts', (req, res, next) => {
    prisma.shoppingCart.create({
      data: req.body
    })
    .then(shoppingCart => res.json(shoppingCart))
    .catch(next);
  });

  app.delete('/shoppingCarts/:shoppingCartId', (req, res, next) => {
    prisma.shoppingCart.delete({
      where: {id: req.shoppingCart.id}
    })
      .then(shoppingCart => res.json(shoppingCart))
      .catch(next);
  });

}
