import fetch from "node-fetch";
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';

const gqlEndpoint = 'https://54srzzin5j.execute-api.eu-west-1.amazonaws.com/staging/graphql';
const masterToken = process.env.MASTER_TOKEN;

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
    },
};

// Create a Apollo Client Context for a given auth token:
const authLink = token =>
    setContext((_, {headers}) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    }));

// Generate an Apollo Client for a given auth token:
const generateClient = token =>
    new ApolloClient({
        link: authLink(token).concat(new HttpLink({uri: gqlEndpoint, fetch})),
        cache: new InMemoryCache(),
        defaultOptions,
    });

module.exports = {
    generateClient,
    masterClient: generateClient(masterToken),
};
