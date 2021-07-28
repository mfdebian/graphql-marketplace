import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_PRODUCT = gql`
	mutation AddProduct($name:String!, $category: String!, $price:Int! ){
		addProduct(name: $name, category: $category, price: $price) {
			name
			category
			price
		}
	}
`;

const AddProduct = () => {

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
	const [price, setPrice] = useState('');
	const [addProduct] = useMutation(ADD_PRODUCT);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!event) {
      return;
    } else {
      addProductHandler(name, category, parseInt(price))
			setName('')
			setCategory('')
			setPrice('')

    }
  }

  const addProductHandler = (name, category, price) => {
    console.log(name, category, price);  
    addProduct({variables: {name: name, category: category, price: price}})
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			})
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Add name"
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <br />
      <input
        type="text"
        name="category"
        placeholder="Add category"
        value={category}
        onChange={event => setCategory(event.target.value)}
      />
      <br />
      <input
        type="number"
        name="price"
        placeholder="Add price"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />
      <br />
      <input
       type="submit"
       value="submit"
      />
    </form>
  );
}

export default AddProduct;
