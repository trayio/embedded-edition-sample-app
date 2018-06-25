const https = require('https');
const express = require('express');
const request = require('request');

import {get} from 'lodash';

import {
    queries,
    mutations,
} from './graphql';

module.exports = function (app) {

    // GET Account:
    app.get('/api/me', (req, res) => {
        queries.me().then((results) => {
            res.status(200).send(results);
        }).catch(reason => {
            res.status(500).send(reason);
        });
    });

    // GET Templates:
    app.get('/api/templates', (req, res) => {
        queries.templates().then((results) => {
            const titles = get(results, 'data.viewer.templates.edges')
                .map(e => e.node.title);
            res.status(200).send(titles);
        }).catch(reason => {
            res.status(500).send(reason);
        });
    });

    // GET Workflows:
    app.get('/api/workflows', (req, res) => {
        queries.workflows().then((results) => {
            const titles = get(results, 'data.viewer.workflows.edges')
                .map(e => e.node.name);
            res.status(200).send(titles);
        }).catch(reason => {
            res.status(500).send(reason);
        });
    });

    // POST Workflows
    app.post('/api/workflows', (req, res) => {
        mutations.createWorkflowFromTemplate()
            .then(uuid => {
                return mutations.getGrantTokenForUser(user, uuid);
            })
            .then(({uuid, grantToken}) => {})
        // Create workflow from template.
        // Given user - create grant token
        // Setup QST links from grant token
    });

};
