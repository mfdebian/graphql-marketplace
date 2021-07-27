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
        return axios.get('http://localhost:4000/products/'+ args.id)
        .then(res => res.data);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parentValue, args){
        return axios.get('http://localhost:4000/products')
        .then(res => res.data);
      }
    }
  }
});

// Mutations
const mutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addProduct:{
      type:ProductType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        category: {type: new GraphQLNonNull(GraphQLString)},
        price: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args){
        return axios.post('http://localhost:4000/products', {
          name:args.name,
          category: args.category,
          price:args.price
        })
        .then(res => res.data);
      }
    },
    deleteProduct:{
      type:ProductType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args){
        return axios.delete('http://localhost:4000/products/'+args.id)
        .then(res => res.data);
      }
    },
    editProduct:{
      type:ProductType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        category: {type: GraphQLString},
        price: {type: GraphQLInt}
      },
      resolve(parentValue, args){
        return axios.patch('http://localhost:4000/products/'+args.id, args)
        .then(res => res.data);
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
