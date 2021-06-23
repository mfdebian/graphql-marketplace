const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// Product Type
const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: {type:GraphQLString},
    name: {type: GraphQLString},
    category: {type: GraphQLString},
    price: {type: GraphQLInt},
  })
});

// Root Query
const RootQuery= new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    product: {
      type: ProductType,
      args: {
        id: {type:GraphQLString}
      },
      resolve(parentValue, args){
        return axios.get('http://localhost:3000/products/'+ args.id)
          .then(res => res.data);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parentValue, args){
        return axios.get('http://localhost:3000/products')
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
