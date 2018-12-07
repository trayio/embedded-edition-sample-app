// Module with all graphql queries and mutations:

import gql from 'graphql-tag';

import { generateClient, masterClient } from './gqlclient';

export const queries = {
    me: token => {
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

        return generateClient(token).query({query});
    },

    templates: () => {
        const query = gql`
            {
                viewer {
                    templates {
                        edges {
                            node {
                                id
                                title
                            }
                        }
                    }
                }
            }
        `;

        return masterClient.query({query});
    },

    solutions: () => {
        const query = gql`
            {
                viewer {
                    solutions {
                        edges {
                            node {
                                id
                                title
                            }
                        }
                    }
                }
            }
        `;

        return masterClient.query({query});
    },

    solutionInstances: token => {
        const query = gql`
            {
                viewer {
                    solutionInstances {
                        edges {
                            node {
                                id
                                name
                                enabled
                            }
                        }
                    }
                }
            }
        `;

        return generateClient(token).query({query});
    },

    solutionInstance: (id, token) => {
        const query = gql`
            {
                viewer {
                    solutionInstances(criteria: {ids: "${id}"}) {
                        edges {
                            node {
                                id
                                name
                                enabled
                            }
                        }
                    }
                }
            }
        `;


        return generateClient(token).query({query});
    },

    workflows: token => {
        const query = gql`
            {
                viewer {
                    workflows {
                        edges {
                            node {
                                id
                                name
                                enabled
                            }
                        }
                    }
                }
            }
        `;

        return generateClient(token).query({query});
    },

    workflow: (id, token) => {
        const query = gql`
            {
                viewer {
                    workflows(criteria: {ids: "${id}"}) {
                        edges {
                            node {
                                id
                                name
                                enabled
                            }
                        }
                    }
                }
            }
        `;


        return generateClient(token).query({query});
    },

    workflowLogs: (id, token) => {
        const query = gql`
            {
                viewer {
                    workflows(criteria: {ids: "${id}"}) {
                        edges {
                            node {
                                logs {
                                    edges {
                                        node {
                                            created
                                            currentState
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;


        return generateClient(token).query({query});
    },

    trayUsername: uuid => {
        const query = gql`
            {
                users(criteria: {externalUserId: "${uuid}"}) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        `;

        return masterClient.query({query});
    }
};

export const mutations = {
    authorize: trayId => {
        const mutation = gql`
            mutation {
                authorize(input: {userId: "${trayId}"}) {
                    accessToken
                }
            }
        `;

        return masterClient.mutate({mutation});
    },

    createSolutionInstance: (userToken, solutionId, name) => {
        const mutation = gql`
            mutation {
                createSolutionInstance(input: {solutionId: "${solutionId}", instanceName: "${name}", authValues: [], configValues: []}) {
                    solutionInstance {
                        id
                    }
                }
            }
        `;

        return generateClient(userToken).mutate({mutation});
    },

    updateSolutionInstance: (userToken, solutionInstanceId, enabled ) => {
        const mutation = gql`
            mutation {
                updateSolutionInstance(input: {solutionInstanceId: "${solutionInstanceId}", enabled: ${enabled}}) {
                    clientMutationId
                }
            }
        `;

        return generateClient(userToken).mutate({mutation});
    },

    createWorkflowFromTemplate: (userToken, templateId) => {
        const mutation = gql`
            mutation {
                createWorkflowFromTemplate(input: {templateId: "${templateId}"}) {
                    workflowId
                }
            }
        `;

        return generateClient(userToken).mutate({mutation});
    },

    createExternalUser: (uuid, name) => {
        const mutation = gql`
            mutation {
                createExternalUser(input : {externalUserId: "${uuid}", name: "${name}"}) {
                    userId
                }
            }
        `;

        return masterClient.mutate({mutation})
    },

    getGrantTokenForUser: (trayId, workflowId) => {
        const mutation = gql`
            mutation {
                generateAuthorizationCode(input: {userId: "${trayId}"}) {
                    authorizationCode
                }
            }
        `;

        return masterClient.mutate({mutation})
            .then(payload => {
                return {
                    payload,
                    workflowId,
                };
            });
    },

    deleteWorkflow: (workflowID, token) => {
        const mutation = gql`
            mutation {
                deleteWorkflow(input: {workflowId: "${workflowID}"}) {
                    clientMutationId
                }
            }
        `;

        return generateClient(token).mutate({mutation});
    },

    updateWorkflowStatus: (workflowID, status, token) => {
        const mutation = gql`
            mutation {
                updateWorkflow(input: {workflowId: "${workflowID}", enabled: ${status}}) {
                    clientMutationId
                }
            }
        `;

        return generateClient(token).mutate({mutation});
    },
}
