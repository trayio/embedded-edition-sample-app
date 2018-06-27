import uuidv1 from 'uuid/v1';

import { log } from '../logging';
import { isNil } from 'lodash';
import { mutations } from "../graphql";
import {
    userExistsInMockDB,
    insertUserToMockDB,
    retrieveUserFromMockDB,
} from '../db';

const validateNewUser = user => {
    const errors = [];
    const fields = ['username', 'password', 'name'];

    fields.forEach(f => {
        if (isNil(user[f]) || user[f] === '') {
            errors.push(f);
        }
    });

    return errors;
};

export const checkUserExists = req =>
    userExistsInMockDB(req.body);

export const validateRequest = req => {
    const validationErrors = validateNewUser(req.body);

    if (validationErrors.length) {
        return {
            valid: false,
            errors: validationErrors,
        };
    }

    return { valid: true };
};

export const generateNewUser = req => {
    // Generate UUID for user:
    const uuid = uuidv1();

    // Generate a tray user for this account:
    return mutations.createExternalUser(uuid, req.body.name)
        .then(createRes => {
            // Add user to internal DB:
            insertUserToMockDB(
                {
                    uuid: uuid,
                    body: req.body,
                    trayId: createRes.data.createExternalUser.userId,
                },
            );

            return retrieveUserFromMockDB(req.body);
        });
};
