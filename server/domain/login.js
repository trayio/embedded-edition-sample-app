/** @module domain/login */

import { get } from 'lodash';
import { mutations } from '../graphql';
import { retrieveUserFromMockDB } from '../db';

/**
 * Attempt to retrieve a user from the DB:
 * @param {Request}
 * @return {User | undefined}
 */
export const attemptLogin = req => {
	return retrieveUserFromMockDB(req);
};

/**
 * Attempt to generate access token for a given user:
 * @param {Request}
 * @param {Response}
 * @param {User}
 * @return {Promise<GQLMutation>} Promise that wraps authorization mutation.
 */
export const generateUserAccessToken = (req, res, user, masterToken) =>
	mutations.authorize(user.trayId, masterToken).then(authorizeResponse => {
		return authorizeResponse.data.authorize.accessToken;
	});