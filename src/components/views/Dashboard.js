import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Nav from '../Nav';
import View from '../View';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

export class Dashboard extends React.Component {

    componentDidMount() {

/*
        WIP
        const httpLink = createHttpLink({
            uri: 'https://54srzzin5j.execute-api.eu-west-1.amazonaws.com/staging/graphql',
        });

        const authLink = setContext((_, { headers }) => {
            // get the authentication token from local storage if it exists
            const token = localStorage.getItem('token');
            // return the headers to the context so httpLink can read them
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : "",
                }
            }
        });

        const client = new ApolloClient({
         /!*   link: authLink.concat(httpLink),*!/
            cache: new InMemoryCache()
        });

        client.query({
            query: gql`
      {
  viewer {
    details {
			username
			email
		}
    }
  }
    `
        }).then(result => console.log(result));
*/

    }

    render() {
        return <View>
            <div> My dashboard content</div>
        </View>
    }
}

export default Dashboard;