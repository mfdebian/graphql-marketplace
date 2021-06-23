const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema.js');
const cors = require('cors');

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
