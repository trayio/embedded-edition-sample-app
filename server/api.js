import {log} from './logging';
import {mutations, queries} from './graphql';
import {get, map, values} from 'lodash';

// Get nodes for a given path from graphQL response:
function getNodesAt (results, path) {
    return map(
        values(get(results, path)),
        x => x.node,
    );
}

module.exports = function (app) {

    // GET Account:
    app.get('/api/me', (req, res) => {
        queries.me(req.session.token)
            .then((results) => res.status(200).send(results.data.viewer.details))
            .catch(err => res.status(500).send(err));
    });

    // GET Templates:
    app.get('/api/templates', (req, res) => {
        queries.templates()
            .then((results) => {
                res.status(200).send({
                    data: getNodesAt(results, 'data.viewer.templates.edges')
                });
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Solutions:
    app.get('/api/solutions', (req, res) => {
        queries.solutions()
            .then((results) => {
                res.status(200).send({
                    data: getNodesAt(results, 'data.viewer.solutions.edges')
                });
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Solution Instances:
    app.get('/api/solutionInstances', (req, res) => {
        const externalUserToken = req.session.token;

        if (!externalUserToken) {
            res.status(500).send('Missing external user auth');
        }

        queries.solutionInstances(externalUserToken)
            .then(results => {
                res.status(200).send({
                    data: getNodesAt(results, 'data.viewer.solutionInstances.edges'),
                });
            })
            .catch(err => res.status(500).send(err));
    });

    // POST Solution Instances
    app.post('/api/solutionInstances', (req, res) => {
        mutations.createSolutionInstance(
            req.session.token,
            req.body.id,
            req.body.name,
        )
            .then(solutionInstance => {
                return mutations.getGrantTokenForUser(
                    req.session.user.trayId,
                ).then(({payload}) => {
                    const solutionInstanceId = solutionInstance.data.createSolutionInstance.solutionInstance.id;
                    const authorizationCode = payload.data.generateAuthorizationCode.authorizationCode;
                    res.status(200).send({
                        data: {
                            popupUrl: `${process.env.TRAY_APP_URL}/external/solutions/${process.env.TRAY_PARTNER}/configure/${solutionInstanceId}?code=${authorizationCode}`
                        }
                    });
                })
            })
            .catch(err => {
                res.status(500).send(err)
            });
    });

    // PATCH Solution Instance configuration:
    app.patch('/api/solutionInstance/:solutionInstanceId/config', (req, res) => {
        mutations.getGrantTokenForUser(
            req.session.user.trayId,
            req.params.solutionInstanceId,
        )
            .then(({payload}) => {
                const authorizationCode = payload.data.generateAuthorizationCode.authorizationCode;
                res.status(200).send({
                    data: {
                        popupUrl: `${process.env.TRAY_APP_URL}/external/solutions/${process.env.TRAY_PARTNER}/configure/${req.params.solutionInstanceId}?code=${authorizationCode}`
                    }
                });
            })
            .catch(err => res.status(500).send({err}));
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
                    data: getNodesAt(results, 'data.viewer.workflows.edges'),
                });
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Workflow:
    app.get('/api/workflows/:workflowId', (req, res) => {
        const externalUserToken = req.session.token;

        if (!externalUserToken) {
            res.status(500).send('Missing external user auth');
        }

        queries.workflow(req.params.workflowId, externalUserToken)
            .then(results => {
                res.status(200).send({
                    data: getNodesAt(results, 'data.viewer.workflows.edges'),
                })
            })
            .catch(err => res.status(500).send(err));
    });

    // GET Workflow Logs:
    app.get('/api/workflows/:workflowId/logs', (req, res) => {
        const externalUserToken = req.session.token;

        if (!externalUserToken) {
            res.status(500).send('Missing external user auth');
        }

        queries.workflowLogs(req.params.workflowId, externalUserToken)
            .then(results =>
                res.status(200).send({
                    data: getNodesAt(results, 'data.viewer.workflows.edges[0].node.logs.edges'),
                })
            )
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
            )
            .then(({payload, workflowId}) => {
                res.status(200).send({
                    data: {
                        popupUrl: `${process.env.TRAY_APP_URL}/external/configure/${process.env.TRAY_PARTNER}/${workflowId}?code=${payload.data.generateAuthorizationCode.authorizationCode}`
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

    // PATCH workflows configuration:
    app.patch('/api/workflows/:workflowId/config', (req, res) => {
        mutations.getGrantTokenForUser(
            req.session.user.trayId,
            req.params.workflowId,
        )
            .then(({payload, workflowId}) => {
                res.status(200).send({
                    data: {
                        popupUrl: `${process.env.TRAY_APP_URL}/external/configure/${process.env.TRAY_PARTNER}/${workflowId}?code=${payload.data.generateAuthorizationCode.authorizationCode}`
                    }
                });
            })
            .catch(err => res.status(500).send({err}));
    });
};
