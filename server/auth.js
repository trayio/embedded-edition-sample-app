const express = require('express');

module.exports = function (app) {

    app.use(require('express-session')({
        secret: '2C44-4D44-WppQ38S',
        resave: true,
        saveUninitialized: true
    }));

// Authentication and Authorization Middleware
    var auth = function(req, res, next) {
        console.log(req.session);
        if (req.session && req.session.user === "amy" && req.session.admin)
            return next();
        else
            return res.sendStatus(401);
    };

// Login endpoint
    app.post('/login', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        console.log(req.body);

        if(req.body.username !== "amy" || req.body.password !== "amyspassword") {
            console.log('login failed');
            res.send('login failed');
        } else if(req.body.username === "amy" && req.body.password === "amyspassword") {
            req.session.user = "amy";
            req.session.admin = true;
            res.send('login successs');
            console.log('login successs');
        }
    });

// Logout endpoint
    app.post('/logout', function (req, res) {
        req.session.destroy();
        res.send("logout success!");
    });

// Get content endpoint
    app.post('/content', auth, function (req, res) {
        res.send("You can only see this after you've logged in.");
    });
}
