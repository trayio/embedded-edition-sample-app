import { get } from 'lodash';
import { mutations } from '../graphql';
import { retrieveUserFromMockDB } from '../db';

export const attemptLogin = req => {
    const user = retrieveUserFromMockDB(req.body);

    if (user) {
        req.session.user = user;
        req.session.admin = true;
    }

    return user;
};

export const generateUserAccessToken = (req, res, user) =>
    mutations.authorize(user.trayId)
        .then(authorizeResponse => {
            req.session.token = get(
                authorizeResponse,
                'data.authorize.accessToken'
            );

            return authorizeResponse;
        });
