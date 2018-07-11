import {log} from './logging';
import {mutations, queries} from './graphql';
import {get, map, values} from 'lodash';

module.exports = function (app) {

    // GET Account:
    app.get('/api/me', (req, res) => {
        queries.me(req.session.token)
            .then((results) => {
                res.status(200).send(results.data.viewer.details);
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Templates:
    app.get('/api/templates', (req, res) => {
        queries.templates()
            .then((results) => {
                res.status(200).send({
                    data: map(
                        values(get(results, 'data.viewer.templates.edges')),
                        x => x.node
                    ),
                });
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Workflows:
    app.get('/api/workflows', (req, res) => {
        const externalUserToken = req.session.token;

        if (!externalUserToken) {
            res.status(500).send('Missing external user auth');
        }

        queries.workflows(externalUserToken)
            .then(results => {
                res.status(200).send({
                    data: map(
                        values(get(results, 'data.viewer.workflows.edges')),
                        x => x.node
                    ),
                })
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Workflow:
    app.get('/api/workflow/:workflowId', (req, res) => {
        const externalUserToken = req.session.token;

        if (!externalUserToken) {
            res.status(500).send('Missing external user auth');
        }

        queries.workflow(req.params.workflowId, externalUserToken)
            .then(results => {
                res.status(200).send(
                    get(results, 'data.viewer.workflows.edges[0].node')
                );
            })
            .catch(err => res.status(500).send(err));
    });

    // POST Workflows
    app.post('/api/workflows', (req, res) => {
        mutations.createWorkflowFromTemplate(
            req.session.token,
            req.body.id,
        )
            .then(workflow =>
                mutations.getGrantTokenForUser(
                    req.session.user.trayId,
                    workflow.data.createWorkflowFromTemplate.workflowId,
                    )
            })
            .then(({payload, workflowId}) => {
                res.status(200).send({
                    data: {
                        popupUrl: `https://app-staging.tray.io/external/configure/prosperworks/${workflowId}?code=${payload.data.generateAuthorizationCode.authorizationCode}`
                    }
                });
            })
            .catch(err => res.status(500).send(err));
    });

    // DELETE workflows:
    app.delete('/api/workflows/:workflowId', (req, res) => {
        mutations.deleteWorkflow(req.params.workflowId, req.session.token)
            .then(_ => res.sendStatus(200))
            .catch(err => res.status(500).send({err}));
    });

    // PATCH workflows:
    app.patch('/api/workflows/:workflowId', (req, res) => {
        mutations.updateWorkflowStatus(
            req.params.workflowId,
            req.body.enabled,
            req.session.token
        )
            .then(_ => res.sendStatus(200))
            .catch(err => res.status(500).send({err}));
    });

};
