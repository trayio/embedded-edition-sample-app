// Module with all graphql queries and mutations:

import gql from 'graphql-tag';

import {
    masterClient,
    generateClient,
} from './gqlclient';

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

        return masterClient.query({query})
    },

    workflows: token => {
        const query = gql`
            {
                viewer {
                    workflows {
                        edges {
                            node {
                                name,
                                id,
                                enabled,
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
        `
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

    createWorkflowFromTemplate: (userToken, templateId) => {
        const mutation = gql`
            mutation {
                createWorkflowFromTemplate(input: {templateId: "${templateId}"}) {
                    workflowId
                }
            }
        `;

        const userClient = generateClient(userToken);

        return userClient.mutate({mutation});
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

    stopWorkflow: (workflowID, token) => {
        const mutation = gql`
            mutation {
                updateWorkflow(input: {workflowId: "${workflowID}", enabled: true}) {
                    clientMutationId
                }
            }
        `;

        return generateClient(token).mutate({mutation});
    },

    startWorkflow: (workflowID, token) => {
        const mutation = gql`
            mutation {
                updateWorkflow(input: {workflowId: "${workflowID}", enabled: false}) {
                    clientMutationId
                }
            }
        `;

        return generateClient(token).mutate({mutation});
    }
}