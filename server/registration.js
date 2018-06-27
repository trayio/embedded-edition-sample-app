import uuidv1 from 'uuid/v1';

import { log } from './logging';
import { isNil } from 'lodash';
import { mutations } from "./graphql";
import {
    userExistsInMockDB,
    insertUserToMockDB,
    retrieveUserFromMockDB,
} from './db';

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

export const checkUserExists = (req, res) => {
    if (userExistsInMockDB(req.body)) {
        res.status(409).send(`User name ${user.username} already exists`);
        return true;
    }

    return false;
}

export const validateRequest = (req, res) => {
    const validationErrors = validateNewUser(req.body);

    if (validationErrors.length) {
        const errorMsg = `The following params missing in user object, [${validationErrors.join(', ')}]`;
        log({ message: errorMsg });
        res.status(400).send(errorMsg);
        return false;
    }

    return true;
};

export const generateNewUser = (req, res) => {
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

            const newUser = retrieveUserFromMockDB(req.body);

            log({
                message: `successfully created user ${req.body.username}`,
                object: newUser,
            });

            res.status(200).send(JSON.stringify(newUser));
        })
        .catch(err => {
            log({
                message: 'There was an error creating the external Tray user:',
                object: err,
            });
            res.status(500).send('There was an error creating the external Tray user:');
        });
};