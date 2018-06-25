// Module with all graphql queries and mutations:

import gql from 'graphql-tag';

const client = require('./client');

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

        return client.query({query});
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

        return client.query({query})
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

        return client.query({query});
    },
};

export const mutations = {
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
            data: client.mutate({variables, mutation}),
        };
    },
};