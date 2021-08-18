import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Navbar from './components/navbar/Navbar.js'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    }
  }),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>E-commerce App</h1>
        <Navbar />
      </div>
    </ApolloProvider>
  );
}

export default App;
