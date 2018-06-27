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
const getTrayUserToken = trayUsername =>
    mutations.authorize(trayUsername)
        .then(authorizeResponse =>
            get(authorizeResponse, 'data.authorize.accessToken')
        ).catch(err => {
            console.error(`Failed to get token for ${uuid}`);
            return null;
        });

module.exports = function (app) {

    app.use(require('express-session')({
        secret: '2C44-4D44-WppQ38S',
        resave: true,
        saveUninitialized: true
    }));

    /*
    * /api/login:
    * Attempt to retrieve user from DB, if not found respond with 401 status,
    * Otherwise attempt to generate a tray access token and set user info onto
    * session.
    */
    app.post('/api/login', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        const currentUser = retrieveUserFromMockDB(req.body);

        if (currentUser) {
            req.session.user = currentUser;
            req.session.admin = true;

            console.log('Logged in with:');
            console.log(currentUser);

            // Generate the external user token
            return getTrayUserToken(currentUser.trayId)
                .then(trayUserToken => {
                    req.session.token = trayUserToken;
                    res.sendStatus(200);
                })
                .catch(err => {
                    console.log('Failed to generate user access token:');
                    console.log(err);
                    res.status(500).send(err);
                });
        }
        
        console.log('Login failed for user:');
        console.log(req.body);
        res.sendStatus(401);
    });

    /*
    * /api/register:
    * Check if user already exists, if so respond with 409 status code.
    * Validate request body, if not valid respond with 400 status code.
    * Otherwise attempt to generate a tray user and insert new user object into
    * the DB.
    */
    app.post('/api/register', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if (userExistsInMockDB(req.body)) {
            res.status(409).send(`User name ${user.username} already exists`);
            return;
        } else if (!req.body.username || !req.body.password || !req.body.name) {
            const errorMsg = `One or more of following params missing in body: username, password, uuid`;
            console.log(errorMsg);
            res.status(400).send(errorMsg);
            return;
        }

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
