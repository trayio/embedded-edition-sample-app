import fetch from "node-fetch";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

const gqlEndpoint = 'https://54srzzin5j.execute-api.eu-west-1.amazonaws.com/staging/graphql';
const masterToken = process.env.MASTER_TOKEN;

// Create a Apollo Client Context for a given auth token:
const authLink = token =>
    setContext((_, {headers}) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${token}`,
            }
        };
    });

// Generate an Apollo Client for a given auth token:
const generateClient = token => {
    return new ApolloClient({
        link: authLink(token).concat(new HttpLink({uri: gqlEndpoint, fetch})),
        cache: new InMemoryCache()
    });
};

module.exports = {
    generateClient,
    masterClient: generateClient(masterToken),
};
