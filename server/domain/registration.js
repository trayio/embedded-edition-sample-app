/** @module domain/registration */

import uuidv1 from 'uuid/v1';

import {isNil} from 'lodash';
import {mutations} from "../graphql";
import {insertUserToMockDB, retrieveUserFromMockDB, userExistsInMockDB,} from '../db';

/**
 * Validate user object:
 * @param {User} user - The user input given
 * @return {Array<Error>} List of missing input fields
 */
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

/**
 * Check if a given user already exists:
 * @param {Request} req
 * @return {Boolean}
 */
export const checkUserExists = req =>
    userExistsInMockDB(req.body);

/**
 * Validate user object from a request:
 * @param {Request} req
 * @return {Validation} Has a valid field and a list of errors if not valud
 */
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

/**
 * Generate a new user:
 * @param {Request} req
 * @return {User} The new user that was created
 */
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
