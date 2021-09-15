const auth = require('./auth');
const products = require('./products');
const shoppingCarts = require('./shoppingCarts');
const users = require('./users');

module.exports = (app) => {
  auth(app);
  products(app);
  shoppingCarts(app);
  users(app);
};
