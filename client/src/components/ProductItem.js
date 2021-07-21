const ProductItem = ({product}) => {
  return (
    <div>
      <h1>{product.name}</h1>
      <h2>{product.category}</h2>
      <h3>${product.price}</h3>
    </div>
  )
}

export default ProductItem;
