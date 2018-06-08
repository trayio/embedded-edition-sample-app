const express = require('express'),
  app = express(),
  promise = require('bluebird'); // or any other Promise/A+ compatible library;

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use((req, res, next) => {
  console.log(`Request made:${req.path}`);
  next()
});

app.listen(process.env.PORT || 3001);

//In production server up the compiled bundle
if (app.get('env') === 'production')
  app.use(express.static('build'));
