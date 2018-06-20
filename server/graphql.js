const express = require('express');
const https = require('https');
const request = require('request');
require('request-debug')(request);

const gqlEndpoint = 'https://54srzzin5j.execute-api.eu-west-1.amazonaws.com/staging/graphql',
    bearer = 'Bearer a18a3da9-f4e6-45a1-b2df-8e5972c45c04';

module.exports = function (app) {

    app.get('/api/account', (req, response) => {

        response.setHeader('Content-Type', 'application/json');

        console.log(`/api/staging/graphql --> Using body:${req.body}`);
        console.log(req.body);

        request.get(`${gqlEndpoint}?query={
  viewer {
    details {
			username
			email
		}
    }
  }`, {
            json: true,
            headers: {
                Authorization: 'Bearer a18a3da9-f4e6-45a1-b2df-8e5972c45c04',
                'User-Agent': 'ua'
            },
        }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

            console.log(res.body);
            console.log(body);
            response.status(200).send(res.body);
        });

    });

}
