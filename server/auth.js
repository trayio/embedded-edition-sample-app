import {mutations, queries} from "./graphql";

const express = require('express');
import {get} from 'lodash';

const uuidv1 = require('uuid/v1');

// In-memory users instead of a DB
const users = [
    {
        username: "amy",
        name: "Amy Tang",
        uuid: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
        password: "amyspassword"
    },
]

module.exports = function (app) {

    app.use(require('express-session')({
        secret: '2C44-4D44-WppQ38S',
        resave: true,
        saveUninitialized: true
    }));

    // Login endpoint
    app.post('/api/login', function (request, response) {
        response.setHeader('Content-Type', 'application/json');
        console.log(request.body);

        const userFound = users.filter(user => user.username === request.body.username && user.password === request.body.password);

        //Is local user able to login?
        if (userFound.length) {
            const user = userFound[0];

            request.session.user = user.username;
            request.session.admin = true;

            //Create new tray external user via calling mutation
            //If user already exists the promise is rejected (checks by uuid)
            mutations.createExternalUser(user.uuid, user.name).then(res => {
                console.log(`Tray external tray user now exists`);
                console.log(res);
            }).catch(err => {
                console.log(`Unable to creat new external tray user`);
                console.log(err);
            }).finally(() => {

                //Get tray external username corresponding to local user uuid
                queries.trayUsername(user.uuid).then(res => {

                    const trayUsername = get(res, 'data.users.edges[0].node.id');
                    if (!trayUsername)
                        res.status(500).send('Unable to retrieve tray external username');

                    console.log(trayUsername);

                    //Create token to be used for external user requests
                    mutations.authorize(trayUsername).then(res => {
                        const token = get(res, 'data.authorize.accessToken');
                        console.log(`Token:${token}`);
                        request.session.token = token;
                        response.status(200).send('login success');
                    }).catch(err => {
                        console.log(`Failed to get token for ${user.username}`);
                        console.log(err);
                    });

                }).catch(err => {
                    console.log(`Failed to get trayUsername for ${user.username}`);
                    console.log(err);
                });

            })

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

        if (users.filter(user => user.username === req.body.username).length) {
            res.status(500).send(`User name ${user.username} already exists`);
        } else if (!req.body.username || !req.body.password || !req.body.name) {
            const errorMsg = `One or more of following params missing in body: username, password, uuid`;
            console.log(errorMsg);
            res.status(500).send(errorMsg);
        } else {
            users.push(
                {
                    username: req.body.username,
                    password: req.body.password,
                    name: req.body.name,
                    uuid: uuidv1(),
                }
            );
            console.log(`successfully created user ${req.body.username}`);
            console.log(users[users.length - 1]);
            res.status(200).send(`successfully created user ${req.body.username}`);
        }
    });

    //Authenticate all endpoints except the four defined in this module
    app.use(function (req, res, next) {
        console.log(req.session);

        if (req.session && req.session.admin)
            return next();
        else
            return res.sendStatus(401);
    });

}
