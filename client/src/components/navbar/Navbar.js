import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

import Home from '../pages/Home.js'
import NotFound from '../pages/NotFound.js'
import Products from '../products/Products.js';
import ShoppingCart from '../shoppingCart/ShoppingCart.js';

import '../../App.css';

const Navbar = () => {
  return (
    <Router>
      <div>

        <button><Link to="/">Home</Link></button>
        <button><Link to="/products">Products</Link></button>
        <button><Link to="/shoppingcart">Shopping Cart</Link></button>

        <hr />
        <Switch>
          <Route exact path="/" component={ Home }/>
          <Route exact path="/products" component={ Products }/>
          <Route exact path="/shoppingcart" component={ ShoppingCart }/>
          <Route component={NotFound}/>
        </Switch>
        

      </div>
    </Router>
  )
}

export default Navbar;