import fetch from "node-fetch";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

const gqlEndpoint = 'https://54srzzin5j.execute-api.eu-west-1.amazonaws.com/staging/graphql';
const masterToken = 'Bearer a18a3da9-f4e6-45a1-b2df-8e5972c45c04';

const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: masterToken,
            //token ? `Bearer ${token}` : "",
        }
    };
});

module.exports = new ApolloClient({
    link: authLink.concat(new HttpLink({uri: gqlEndpoint, fetch})),
    cache: new InMemoryCache()
});

