const products = require('./products');
const shoppingCarts = require('./shoppingCarts');

module.exports = (app) => {
  products(app);
  shoppingCarts(app);
}
