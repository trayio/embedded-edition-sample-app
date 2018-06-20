import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Nav from '../Nav';
import View from '../View';
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import request from 'request';
import {get} from 'lodash';


export class Account extends React.Component {

    state = {
        loading: true,
        userInfo: {},
    }

    componentDidMount() {

        request.get('http://localhost:3000/api/account', (error, response, body) => {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.

            this.setState({
                userInfo: JSON.parse(body),
                loading: false,
            })
        });
    }

    render() {
        let data;
        if (this.state.loading) {
            data = <div>Loading...</div>;
        } else {
            data = <div>{get(this.state, 'userInfo.data.viewer.details.email')}</div>
        }
        return (
            <View>
                {data}
            </View>
        )
    }
}

export default Account;