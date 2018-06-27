const express = require('express');
const uuidv1 = require('uuid/v1');

import { log } from './logging';
import { get, isNil } from 'lodash';
import { mutations, queries } from "./graphql";
import {
    userExistsInMockDB,
    insertUserToMockDB,
    retrieveUserFromMockDB,
} from './db';

/**
 * Returns the tray user accesstoken that is used to authenticate operations
 * related to individiual accounts (for instance configure workflow operation)
 * This is different than the master token which is shared across the entire
 * partner organization (used to create users for instance)
 * @param trayUsername - trayUsername generated when user is created
 * (different from local ID that was passed to tray during user creation)
 *
 * Returns promise that resolves to the token [string] or null if it didn't work
 */
const getTrayUserToken = trayUsername =>
    mutations.authorize(trayUsername)
        .then(authorizeResponse =>
            get(authorizeResponse, 'data.authorize.accessToken')
        ).catch(err => {
            log({ message: `Failed to get token for ${uuid}` });
            return null;
        });

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

module.exports = function (app) {

    app.use(require('express-session')({
        secret: '2C44-4D44-WppQ38S',
        resave: true,
        saveUninitialized: true
    }));

    /*
    * /api/login:
    * Attempt to retrieve user from DB, if not found respond with 401 status.
    * Otherwise attempt to generate a tray access token and set user info onto
    * session.
    */
    app.post('/api/login', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        const currentUser = retrieveUserFromMockDB(req.body);

        if (currentUser) {
            req.session.user = currentUser;
            req.session.admin = true;

            log({
                message: 'Logged in with:',
                object: currentUser,
            });

            // Generate the external user token
            return getTrayUserToken(currentUser.trayId)
                .then(trayUserToken => {
                    req.session.token = trayUserToken;
                    res.sendStatus(200);
                })
                .catch(err => {
                    log({
                        message: 'Failed to generate user access token:',
                        object: err,
                    });
                    res.status(500).send(err);
                });
        }

        log({
            message: 'Login failed for user:',
            object: req.body,
        });
        res.sendStatus(401);
    });

    const checkUserExists = (req, res) => {
        if (userExistsInMockDB(req.body)) {
            res.status(409).send(`User name ${user.username} already exists`);
            return true;
        }

        return false;
    }

    const validateRequest = (req, res) => {
        const validationErrors = validateNewUser(req.body);

        if (validationErrors.length) {
            const errorMsg = `The following params missing in user object, [${validationErrors.join(', ')}]`;
            log({ message: errorMsg });
            res.status(400).send(errorMsg);
            return false;
        }

        return true;
    };

    const generateNewUser = (req, res) => {
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

    /*
    * /api/register:
    * Check if user already exists, if so respond with 409 status.
    * Validate request body, if not valid respond with 400 status.
    * Otherwise attempt to generate a tray user and insert new user object into
    * the DB.
    */
    app.post('/api/register', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if (checkUserExists(req, res)) {
            return;
        }

        if (!validateRequest(req, res)) {
            return;
        }

        generateNewUser(req, res);
    });

    /*
    * /api/logout:
    * Remove session data.
    */
    app.post('/api/logout', function (req, res) {
        req.session.destroy();
        res.sendStatus(200);
    });

    // Authenticate all endpoints except the auth endpoints defined in this module
    app.use(function (req, res, next) {
        if (req.session && req.session.admin) {
            return next();
        } else {
            return res.sendStatus(401);
        }
    });

}
