import {mutations, queries} from "./graphql";

const express = require('express');
import {get} from 'lodash';

const uuidv1 = require('uuid/v1');

// In-memory users instead of a DB
const allUsersDB = [
    {
        username: "amy",
        name: "Amy Tang",
        uuid: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
        trayId: "da774c77-abd7-4161-8e47-f5f67da81808",
        password: "amyspassword",
    },
]

/**
 * Retreive user from the DB (simple in-memory array in this instance)
 * @param allUsers - array of all in-memory user
 * @param current - {username: 'myname', password: 'mypass'}
 * @returns - the found user object or undefined if not found
 */
const retrieveUserFromMockDB = (allUsers, current) => {
    const userFound = allUsersDB.filter(user => user.username === current.username && user.password === current.password);
    return userFound[0];
};

/**
 * Returns the external user token that is used to authenticate operations related to individiual accounts (for instance configure workflow operation)
 * This is different than the master token which is shared across the entire partner organization (used to create users for instance)
 * @param trayUsername - trayUsername generated when user is created (different from local ID that was passed to tray during user creation)
 * Returns promise that resolves to the token [string] or null if it didn't work
 */
const getExternalUserToken = trayUsername => {
    // Create token to be used for external user requests
    return mutations.authorize(trayUsername).then(authorizeResponse => {
        return get(authorizeResponse, 'data.authorize.accessToken');
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
    app.post('/api/login', function (request, response) {
        response.setHeader('Content-Type', 'application/json');

        const currentUser = retrieveUserFromMockDB(allUsersDB, request.body);

        // Is local user able to login?
        if (currentUser) {
            request.session.user = currentUser;
            request.session.admin = true;

            // Generate the external user token
            getExternalUserToken(currentUser.trayId).then(externalUserToken => {
                request.session.token = externalUserToken;
                response.status(200).send('Succesfully logged, assigned external user token to session.');
            });
        } else {
            console.log('login failed');
            response.status(401).send('login failed');
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
        console.log(req.body);

        if (allUsersDB.filter(user => user.username === req.body.username).length) {
            res.status(500).send(`User name ${user.username} already exists`);
        } else if (!req.body.username || !req.body.password || !req.body.name) {
            const errorMsg = `One or more of following params missing in body: username, password, uuid`;
            console.log(errorMsg);
            res.status(500).send(errorMsg);
        } else {
            const uuid = uuidv1();
            mutations.createExternalUser(uuid, req.body.name).then(createRes => {
                console.log(`We have now created the external tray user:`);
                console.log(res);

                allUsersDB.push(
                    {
                        uuid: uuid,
                        name: req.body.name,
                        username: req.body.username,
                        password: req.body.password,
                        trayId: createRes.data.createExternalUser.userId,
                    }
                );

                console.log(`successfully created user ${req.body.username}`);
                console.log(allUsersDB[allUsersDB.length - 1]);
                res.status(200).send(`successfully created user ${req.body.username}`);
            }).catch(err => {
                console.log('There was an error creating the external Tray user:')
                console.log(err);
            });
        }
    });

    // Authenticate all endpoints except the four defined in this module
    app.use(function (req, res, next) {
        console.log(req.session);

        if (req.session && req.session.admin) {
            return next();
        } else {
            return res.sendStatus(401);
        }
    });

}
