import { useMutation } from '@apollo/client';
import { PRODUCTS_QUERY, DELETE_PRODUCT } from '../graphql/graphQLQueries';

const ProductItem = ({product}) => {

  const { id, name, category, price } = product;
  const [deleteProduct] = useMutation(DELETE_PRODUCT,
    {
      refetchQueries: [
        {query: PRODUCTS_QUERY},
        'ProductsQuery'
      ],
    }
    );

  const deleteProductHandler = (event) => {
    let idOfProductToBeDeleted = event.target.value;

    deleteProduct({variables: {id: idOfProductToBeDeleted}})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }


  return (
    <div>
      <h1>{name}</h1>
      <h2>{category}</h2>
      <h3>${price}</h3>
      <button value={id} onClick={deleteProductHandler}>delete</button>
    </div>
  )
}

export default ProductItem;
