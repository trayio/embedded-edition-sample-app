const express = require('express'),
    app = express(),
    promise = require('bluebird'); // or any other Promise/A+ compatible library;

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", ["http://localhost:3000"]);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const gqlClient = require('./client');

// Authentication and Authorization Middleware

// Configure Express application.
app.use(require('morgan')('tiny'));
require('./auth')(app);
require('./graphql')(app, gqlClient);

//app.use(express.static('build'))

app.listen(process.env.PORT || 3001, () => {
    console.log(`Express started on port ${process.env.PORT || 3001}`);
});

