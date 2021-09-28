const express = require('express');
const cors = require('cors');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const schema = require('./graphql/schema.js');
const registerRoutes = require('./routes');
const notFoundhandler = require('./middleware/404');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');

dotenv.config();

const { JWT_SECRET } = process.env;

const prisma = new PrismaClient();

/*
TO TEST MODELS QUICKLY
prisma.user.create({
  data: {
    name: "user de prueba",
    email: "user@user.com",
    password: "123456",
    role: "admn"
  }
})
.then(res => {
  console.log("THEN RESPONSE:", res);
})
.catch(err => {
});
*/
/*
let shoppingCart = {
  user: {
    connect: { id: 1 }
  },
  shoppingCartProducts: {
    create: {
      productId: 1,
      quantity: 1
    }
  }
}

prisma.shoppingCart.upsert({
  where: {createdBy: 1},
  create: shoppingCart,
  update: shoppingCart
})
.then(console.log)
.catch(console.error) */




const app = express();

app.set('prisma', prisma);
app.set('jwtSecret', JWT_SECRET);

// enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *
app.use(cors());

// parse json
app.use(express.json());

app.use(authMiddleware(app));

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));

registerRoutes(app);

//middlewares
app.use(notFoundhandler);
app.use(errorHandler);

const port = 4000;

if (require.main === module) {
  app.listen(port, () => {
    console.log("The server is running on port:", port);
  });
}

exports.app = app;