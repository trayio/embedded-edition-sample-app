const https = require('https');
const express = require('express');
const request = require('request');

import { get, values, map } from 'lodash';

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
            console.log(results)
            res.status(200).send({
                data: map(values(get(results, 'data.viewer.templates.edges')), x => x.node),
            });
        }).catch(reason => {
            res.status(500).send(reason);
        });
    });

    // GET Workflows:
    app.get('/api/workflows', (req, res) => {
        queries.workflows().then((results) => {
            res.status(200).send({
                data: map(values(get(results, 'data.viewer.workflows.edges')), x => x.node),
            });
        }).catch(reason => {
            res.status(500).send(reason);
        });
    });

    // POST Workflows
    app.post('/api/workflows', (req, res) => {
        mutations.createWorkflowFromTemplate()
            .then(uuid => {
                return mutations.getGrantTokenForUser(req.session.user, uuid);
            })
            .then(({uuid, data}) => {
                console.log(uiud, data)
            });
        // Create workflow from template.
        // Given user - create grant token
        // Setup QST links from grant token
    });

};
