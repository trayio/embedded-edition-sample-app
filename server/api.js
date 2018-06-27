const https = require('https');
const express = require('express');
const request = require('request');

import { get, values, map } from 'lodash';

import {
    queries,
    mutations,
} from './graphql';

function withErrorHandling(promise) {
    return promise.catch(err => res.status(500).send(err));
}

module.exports = function (app) {

    // GET Account:
    app.get('/api/me', (req, res) => {
        withErrorHandling(
            queries.me()
            .then((results) => {
                res.status(200).send(results);
            })
        );
    });

    // GET Templates:
    app.get('/api/templates', (req, res) => {
        withErrorHandling(
            queries.templates()
            .then((results) => {
                res.status(200).send({
                    data: map(values(get(results, 'data.viewer.templates.edges')), x => x.node),
                });
            })
        );
    });

    // GET Workflows:
    app.get('/api/workflows', (req, res) => {
        const externalUserToken = req.session.token;

        if (!externalUserToken) {
            res.status(500).send('Missing external user auth');
        }

        withErrorHandling(
            queries.workflows(externalUserToken)
            .then(results => {
                res.status(200).send({
                    data: map(values(get(results, 'data.viewer.workflows.edges')), x => x.node),
                });
            })
        );
    });

    // POST Workflows
    app.post('/api/workflows', (req, res) => {
        withErrorHandling(
            mutations.createWorkflowFromTemplate(
                req.session.token,
                req.body.id,
            )
            .then(workflow => {
                return mutations.getGrantTokenForUser(
                    req.session.externalId,
                    workflow.data.createWorkflowFromTemplate.workflowId
                );
            })
            .then(({uuid, payload, workflowId}) => {
                res.status(200).send({
                    data: {
                        popupUrl: `https://app-staging.tray.io/external/configure/prosperworks/${workflowId}?code=${payload.data.generateAuthorizationCode.authorizationCode}`
                    }
                });
            })
        );
    });

};
