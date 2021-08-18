import { useQuery } from '@apollo/client';
import { PRODUCTS_QUERY } from '../graphql/graphQLQueries.js'
import ProductItem from './ProductItem.js';
import AddProduct from './AddProduct.js';

const Products = () => {
  const { data, loading, error } = useQuery(PRODUCTS_QUERY);

  if (loading) return <h2>Loading...</h2>
  if (error) return <p>ERROR</p>
  if (!data) return <p>Not found</p>
  let products = data.products.slice();
  products = products.reverse();

  return (
    <div>
      <h1>Products</h1>
      <AddProduct />
      {
        products.map(product => {
          return <ProductItem key={product.id} product={product} />
        })
      }
    </div>
  )
}

export default Products;
