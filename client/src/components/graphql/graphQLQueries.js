import { gql } from '@apollo/client';

export const PRODUCTS_QUERY = gql`
query ProductsQuery {
  products {
    id,
    name,
    price,
    category
  }
}
`;

export const ADD_PRODUCT = gql`
	mutation AddProduct($name:String!, $category: String!, $price:Int! ){
		addProduct(name: $name, category: $category, price: $price) {
			name
			category
			price
		}
	}
`;

export const DELETE_PRODUCT = gql`
mutation deleteProduct($id:String!){
  deleteProduct(id: $id) {
    id
  }
}
`;