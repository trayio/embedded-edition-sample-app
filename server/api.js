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
        queries.me(req.session.token)
            .then((results) => res.status(200).send(results))
            .catch(err => res.status(500).send(err));
    });

    // GET Templates:
    app.get('/api/templates', (req, res) => {
        queries.templates()
            .then((results) => {
                res.status(200).send({
                    data: map(
                        values(get(results, 'data.viewer.templates.edges')),
                        x => x.node,
                    ),
                });
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Workflows:
    app.get('/api/workflows', (req, res) => {
        if (!req.session.token) {
            res.status(500).send('Missing external user token on session');
        }

        queries.workflows(req.session.token)
            .then(results => {
                res.status(200).send({
                    data: map(
                        values(get(results, 'data.viewer.workflows.edges')),
                        x => x.node,
                    ),
                })
            })
            .catch(err => res.status(500).send(err));
    });

    // POST Workflows
    app.post('/api/workflows', (req, res) => {
        mutations.createWorkflowFromTemplate(
            req.session.token,
            req.body.id,
        )
        .then(workflow => {
            return mutations.getGrantTokenForUser(
                req.session.user.trayId,
                workflow.data.createWorkflowFromTemplate.workflowId,
            );
        })
        .then(({payload, workflowId}) => {
            res.status(200).send({
                data: {
                    popupUrl: `https://app-staging.tray.io/external/configure/prosperworks/${workflowId}?code=${payload.data.generateAuthorizationCode.authorizationCode}`
                }
            });
        })
        .catch(err => {
            res.status(500).send(err)
        });
    });

};
