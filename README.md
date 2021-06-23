docs: https://graphql.org/learn/queries/
run data server: npx json-server --watch data.json
run express server: node server.js
query one product:
example 1:
{
  product(id:"1") {
    name
  }
}

example 2:
{
  product(id:"1") {
    id,
    name,
    category,
    price
  }
}

query all products:
example 1:
{
  products {
    id,
    name,
    price,
    category
  }
}

example 2:
{
  products {
		category
  }
}
