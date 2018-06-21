const express = require('express');
const https = require('https');
const request = require('request');
require('request-debug')(request);

const gqlEndpoint = 'https://54srzzin5j.execute-api.eu-west-1.amazonaws.com/staging/graphql',
    bearer = 'Bearer a18a3da9-f4e6-45a1-b2df-8e5972c45c04';

import gql from 'graphql-tag'

module.exports = function (app, client) {

    app.get('/api/account', (req, response) => {

        let query = gql`
            {
                viewer {
                    details {
                        username
                        email
                    }
                }
            }
        `
        client.query({query}).then((results) => {
            response.status(200).send(results);
        }).catch(reason => {
            response.status(500).send(reason);
        })
    });

    app.get('/api/templates', (req, response) => {
        let query = gql`
            {
                viewer {
                    templates {
                        edges {
                            node {
                                title
                            }
                        }
                    }
                }
            }
        `
        client.query({query}).then((results) => {
            response.status(200).send(results);
        }).catch(reason => {
            response.status(500).send(reason);
        })
    });

}
