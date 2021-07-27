const express = require('express');
const cors = require('cors');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./graphql/schema.js');
const { PrismaClient } = require('@prisma/client');
const registerRoutes = require('./routes');
const notFoundhandler = require('./middleware/404');
const errorHandler = require('./middleware/error');

const prisma = new PrismaClient();

const app = express();

app.set('prisma', prisma);

// enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *
app.use(cors());

// parse json
app.use(express.json());

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));

registerRoutes(app);

//middlewares
app.use(notFoundhandler);
app.use(errorHandler);

const port = 4000;

app.listen(port, () => {
  console.log("The server is running on port:", port);
});
