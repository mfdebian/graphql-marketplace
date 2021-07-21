import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ProductItem from './ProductItem.js';

const PRODUCTS_QUERY = gql`
  query ProductsQuery {
    products {
      id,
      name,
      price,
      category
    }
  }
`;

const Products = () => {
  return (
    <div>
      Products component
      <Query query={PRODUCTS_QUERY}>
        {
          ({loading, error, data}) => {
            if(loading) return <h2>Loading...</h2>
            if(error) console.log(error);

            return <div>
              {
                data.products.map(product => {
                  return <ProductItem key={product.id} product={product}/>
                })
              }
            </div>

          }
        }
      </Query>
    </div>
  )
}

export default Products;
