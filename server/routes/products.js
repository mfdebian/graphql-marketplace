// request handler
module.exports = (app) => {
  const prisma = app.get('prisma');
  app.param('productId', (req, res, next, idString) => {
    // change id string to be Int instead of String
    let idInt = parseInt(idString);
    prisma.product.findUnique({
      where: {id: idInt}
    })
      .then(product => {
        if(!product) {
          return next(404);
        }
        // asign the received product to the 'product' attribute of req
        req.product = product;
        next();
      })
      .catch(next)
  });

  app.get('/products', (request, response, next) => {
    prisma.product.findMany({orderBy: [{id: 'asc'}]})
      .then(products => {

        response.json(products);
      })
      .catch(next);
  });

  app.get('/products/:productId', (req, res, next) => {
    res.json(req.product);
  });

  app.post('/products', (req, res, next) => {
    prisma.product.create({
      data: req.body
    })
    .then(product => res.json(product))
    .catch(next);
  });

  app.delete('/products/:productId', (req, res, next) => {
    prisma.product.delete({
      where: {id: req.product.id}
    })
      .then(product => res.json(product))
      .catch(next);
  });

}
