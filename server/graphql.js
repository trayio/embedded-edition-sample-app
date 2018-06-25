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
    }
};

export const mutations = {

};
