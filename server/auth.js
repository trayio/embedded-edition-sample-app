const express = require('express');
import {get} from 'lodash';

// In-memory users instead of a DB
const users = [
    {
        username: "amy",
        password: "amyspassword"
    },
    {
        username: "test",
        password: "test"
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

        const usrFound = users.filter(user => user.username === req.body.username && user.password === req.body.password);

        if (usrFound.length) {
            req.session.user = get(usrFound, '[0].username');
            req.session.admin = true;
            res.send('login successs');
            console.log('login successs');
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

        if (req.body.username && req.body.password) {
            users.push(
                {
                    username: req.body.username,
                    password: req.body.password,
                }
            )

            console.log(`successfully created user ${req.body.username}`);
            res.status(200).send(`successfully created user ${req.body.username}`);
        } else {
            console.log(`unable to create user from ${req.body}`);
            res.status(200).send(`unable to create user from ${req.body}`);
        }
    });

    //Authenticate all endpoints except the four defined in this module
    app.use(function (req, res, next) {
        console.log(req.session);

        //WARNING: Right now only user 'amy' can successfully authenticate with API
        if (req.session && req.session.user === "amy" && req.session.admin)
            return next();
        else
            return res.sendStatus(401);
    });
}
