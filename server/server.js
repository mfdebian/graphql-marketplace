const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./graphql/schema.js');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

// how to save data into the database
// prisma.product.create({
//   data: {
//     name: "Guitar",
//     category: "Musical Instruments",
//     price: 500
//   }
// })
// .then(res => {
//   console.log("RES:", res);
// })
// .catch(err => {
//   console.log("ERR:", err);
// });

const app = express();

// enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *
app.use(cors());

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));

const port = 4000;

app.listen(port, () => {
  console.log("The server is running on port:", port);
});
