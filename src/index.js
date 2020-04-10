import React from 'react';
import ReactDOM from 'react-dom';
import '../src/styles/index.css';
import App from '../src/components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'

// Imports required to configure Apollo Client
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
// A middleware that let you modify requests before they are sent to the server
import { setContext } from 'apollo-link-context';

// Adding Subscriptions
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { AUTH_TOKEN } from './constants';

const httpLink = new createHttpLink({
    uri: 'http://localhost:4000',
});

// knows the subscriptions endpoint
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem(AUTH_TOKEN),
      }
    }
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
});

// split is used to “route” a request to a specific middleware link.
// you need to subscribe to events that are happening on the Link type.
// events like a new link creation or existing link updation/deletion.
const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({
    // link: authLink.concat(httpLink), // before adding subscriptions
    link,
    cache:new InMemoryCache(),
});

// ApolloProvider passes Client as props to all the components below.
ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
