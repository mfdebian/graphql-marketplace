import { gql, useMutation } from '@apollo/client';

const DELETE_PRODUCT = gql`
  mutation deleteProduct($id:String!){
    deleteProduct(id: $id) {
      id
    }
  }
`;

const ProductItem = (props) => {

  const { id, name, category, price } = props.product;
  const [deleteProduct] = useMutation(DELETE_PRODUCT,
    {
      refetchQueries: [
        {query: props.productsQueryToBeRefetchedAfterMutation},
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
