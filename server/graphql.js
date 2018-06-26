// Module with all graphql queries and mutations:

import gql from 'graphql-tag';

import {
    masterClient,
    generateClient,
} from './client';

export const queries = {
    me: () => {
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

        return masterClient.query({query});
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

    workflows: () => {
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

        return masterClient.query({query});
    },
};

export const mutations = {
    authorize: (userId) => {
        const mutation = gql`
            mutation ($userId: ID!) {
                authorize(input: {userId: $userId}) {
                    accessToken
                }
            }
        `;

        const variables = {
            userId,
        };

        return masterClient.mutate({mutation, variables});
    },

    createWorkflowFromTemplate: (userToken, templateId) => {
        const mutation = gql`
            mutation ($templateId: ID!) {
                createWorkflowFromTemplate(input: {templateId: $templateId}) {
                    workflowId
                }
            }
        `;

        const variables = {
            templateId,
        };

        const userClient = generateClient(userToken);

        return userClient.mutate({mutation, variables});
    },

    createExternalUser: (id, name) => {
        return client.mutate({
            mutation: gql`
                mutation {
                    createExternalUser(input : {externalUserId: "${id}", name: "${name}"}) {
                        userId
                    }
                }
            `
        })
    },

    getGrantTokenForUser: (user, uuid) => {
        const mutation = gql`
            mutation ($userId: ID!) {
                generateAuthorizationCode(input: {userId: $userId}) {
                    authorizationCode
                }
            }
        `;

        const variables = {
            userId: '388ce871-1639-4215-a3f0-04ea3e5e0c14',
        };

        return {
            uuid: '388ce871-1639-4215-a3f0-04ea3e5e0c14',
            data: masterClient.mutate({variables, mutation}),
        };
    },
}