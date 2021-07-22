import './App.css';
// todo: change package for @apollo/client
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Products from './components/Products.js'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Main App Component</h1>
        <Products />
      </div>
    </ApolloProvider>
  );
}

export default App;
