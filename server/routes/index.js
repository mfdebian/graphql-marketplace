const products = require('./products');
const shoppingCarts = require('./shoppingCarts');
const users = require('./users');

module.exports = (app) => {
  products(app);
  shoppingCarts(app);
  users(app);
}
