// Module with all graphql queries and mutations:

import gql from 'graphql-tag';

import { generateClient } from './gqlclient';

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

		return generateClient(token).query({ query });
	},

	solutions: masterToken => {
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

		return generateClient(masterToken).query({ query });
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

		return generateClient(token).query({ query });
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

		return generateClient(token).query({ query });
	},

	trayUsername: (uuid, masterToken) => {
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

		return generateClient(masterToken).query({ query });
	},
};

export const mutations = {
	authorize: (trayId, masterToken) => {
		const mutation = gql`
            mutation {
                authorize(input: {userId: "${trayId}"}) {
                    accessToken
                }
            }
        `;

		return generateClient(masterToken).mutate({ mutation });
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

		return generateClient(userToken).mutate({ mutation });
	},

	updateSolutionInstance: (userToken, solutionInstanceId, enabled) => {
		const mutation = gql`
            mutation {
                updateSolutionInstance(input: {solutionInstanceId: "${solutionInstanceId}", enabled: ${enabled}}) {
                    clientMutationId
                }
            }
        `;

		return generateClient(userToken).mutate({ mutation });
	},

	createExternalUser: (uuid, name, masterToken) => {
		const mutation = gql`
            mutation {
                createExternalUser(input : {externalUserId: "${uuid}", name: "${name}"}) {
                    userId
                }
            }
        `;

		return generateClient(masterToken).mutate({ mutation });
	},

	getGrantTokenForUser: (trayId, workflowId, masterToken) => {
		const mutation = gql`
            mutation {
                generateAuthorizationCode(input: {userId: "${trayId}"}) {
                    authorizationCode
                }
            }
        `;

		return generateClient(masterToken).mutate({ mutation }).then(payload => {
			return {
				payload,
				workflowId,
			};
		});
	},

	deleteSolutionInstance: (userToken, solutionInstanceId) => {
		const mutation = gql`
            mutation {
                removeSolutionInstance(input: {solutionInstanceId: "${solutionInstanceId}"}) {
                    clientMutationId
                }
            }
        `;

		return generateClient(userToken).mutate({ mutation });
	},
};
