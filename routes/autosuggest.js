'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
  const url = "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/UK/GBP/en-GB/?query=" + req.query.query + "&apiKey=aa219678594276332752311136353209"
  request.get(url,
      function(error, response, body) {
          if(!error && response.statusCode == 200) {
              res.send(body);
          }
      });
});

module.exports = router;
