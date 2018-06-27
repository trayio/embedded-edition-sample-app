const express = require('express');
const uuidv1 = require('uuid/v1');

import { get } from 'lodash';
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
const getTrayUserToken = trayUsername => {
    // Create token to be used for external user requests
    return mutations.authorize(trayUsername)
        .then(authorizeResponse => {
            return get(authorizeResponse, 'data.authorize.accessToken')
        }).catch(err => {
            console.error(`Failed to get token for ${uuid}`);
            return null;
        });
};

module.exports = function (app) {

    app.use(require('express-session')({
        secret: '2C44-4D44-WppQ38S',
        resave: true,
        saveUninitialized: true
    }));

    // Login endpoint
    app.post('/api/login', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        const currentUser = retrieveUserFromMockDB(req.body);

        // Is local user able to login?
        if (currentUser) {
            req.session.user = currentUser;
            req.session.admin = true;

            console.log('Logged in with:');
            console.log(currentUser);

            // Generate the external user token
            getTrayUserToken(currentUser.trayId)
                .then(trayUserToken => {
                    req.session.token = trayUserToken;
                    res.sendStatus(200);
                });
        } else {
            console.log('Login failed for user:');
            console.log(req.body);
            res.sendStatus(401);
        }
    });

    // Logout endpoint
    app.post('/api/logout', function (req, res) {
        req.session.destroy();
        res.send("logout success!");
    });

    // Register endpoint
    app.post('/api/register', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if (userExistsInMockDB(req.body)) {
            res.status(500).send(`User name ${user.username} already exists`);
        } else if (!req.body.username || !req.body.password || !req.body.name) {
            const errorMsg = `One or more of following params missing in body: username, password, uuid`;
            console.log(errorMsg);
            res.status(500).send(errorMsg);
        } else {
            // Generate UUID for user:
            const uuid = uuidv1();

            // Generate a tray user for this account:
            mutations.createExternalUser(uuid, req.body.name).then(createRes => {
                // Add user to internal DB:
                insertUserToMockDB(
                    {
                        uuid: uuid,
                        name: req.body.name,
                        trayId: createRes.data.createExternalUser.userId,
                        username: req.body.username,
                        password: req.body.password,
                    },
                );

                const newUser = retrieveUserFromMockDB(req.body);

                console.log(`successfully created user ${req.body.username}`);
                console.log(newUser);
                res.status(200).send(JSON.stringify(newUser));
            }).catch(err => {
                console.log('There was an error creating the external Tray user:');
                console.log(err);
                res.status(500).send('There was an error creating the external Tray user:');
            });
        }
    });

    // Authenticate all endpoints except the four defined in this module
    app.use(function (req, res, next) {
        if (req.session && req.session.admin) {
            return next();
        } else {
            return res.sendStatus(401);
        }
    });

}
