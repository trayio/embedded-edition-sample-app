import {mutations} from "./graphql";

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
    app.post('/api/login', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        console.log(req.body);

        const userFound = users.filter(user => user.username === req.body.username && user.password === req.body.password);

        if (userFound.length) {
            req.session.user = get(userFound, '[0].username');
            req.session.admin = true;
            res.send('login successs');
            console.log('login successs');

            //Create new tray user via calling gql mutation
            mutations.createExternalUser(userFound[0].uuid, userFound[0].name).then(res => {
                console.log(`Successfully created external tray user`);
                console.log(res);
            }).catch(err => {
                console.log(`Failed to creat new external tray user`);
                console.log(err);
            });

        } else {
            console.log('login failed');
            res.status(401).send('login failed');
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
