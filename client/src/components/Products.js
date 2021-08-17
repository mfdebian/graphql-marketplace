import { gql, useQuery } from '@apollo/client';
import ProductItem from './ProductItem.js';
import AddProduct from './AddProduct.js';

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
  const { data, loading, error } = useQuery(PRODUCTS_QUERY);

  if (loading) return <h2>Loading...</h2>
  if (error) return <p>ERROR</p>
  if (!data) return <p>Not found</p>
  let products = data.products.slice();
  products = products.reverse();

  return (
    <div>
      <AddProduct productsQueryToBeRefetchedAfterMutation={PRODUCTS_QUERY}/>
      {
        products.map(product => {
          return <ProductItem key={product.id} product={product} productsQueryToBeRefetchedAfterMutation={PRODUCTS_QUERY}/>
        })
      }
    </div>
  )
}

export default Products;
