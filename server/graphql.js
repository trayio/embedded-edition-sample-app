const https = require('https');
const express = require('express');
const request = require('request');

import { get } from 'lodash';

const gqlEndpoint = 'https://54srzzin5j.execute-api.eu-west-1.amazonaws.com/staging/graphql';
const bearer = 'Bearer a18a3da9-f4e6-45a1-b2df-8e5972c45c04';

import gql from 'graphql-tag';

module.exports = function (app, client) {

    // GET Account:
    app.get('/api/me', (req, res) => {
        const query = gql`
            {
                viewer {
                    details {
                        username
                        email
                    }
                }
            }
        `;

        client.query({query})
            .then((results) => {
                res.status(200).send(results);
            }).catch(reason => {
                res.status(500).send(reason);
            });
    });

    // GET Templates:
    app.get('/api/templates', (req, res) => {
        const query = gql`
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
        `;

        client.query({query})
            .then((results) => {
                const titles = get(results, 'data.viewer.templates.edges')
                    .map(e => e.node.title);
                res.status(200).send(titles);
            }).catch(reason => {
                res.status(500).send(reason);
            });
    });

    // GET Workflows:
    app.get('/api/workflows', (req, res) => {
        const query = gql`
            {
                viewer {
                    workflows {
                        edges {
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        client.query({query})
            .then((results) => {
                const titles = get(results, 'data.viewer.workflows.edges')
                    .map(e => e.node.name);
                res.status(200).send(titles);
            }).catch(reason => {
                res.status(500).send(reason);
            });
    });

};
