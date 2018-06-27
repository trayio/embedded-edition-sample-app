
import { log } from './logging';
import { get } from 'lodash';
import { mutations } from "./graphql";
import { retrieveUserFromMockDB } from './db';

import {
    checkUserExists,
    generateNewUser,
    validateRequest,
} from './registration'

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

            // Generate the external user token and save to session:
            return mutations.authorize(currentUser.trayId)
                .then(authorizeResponse => {
                    req.session.token = get(
                        authorizeResponse,
                        'data.authorize.accessToken'
                    );
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
