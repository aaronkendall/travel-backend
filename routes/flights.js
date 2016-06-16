'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

let returnData = {
  'outboundFlight': {
    'originAirport': 'London Stansted (STN)',
    'originId': 1234,
    'destinationAirport': 'Barcelona (ABC)',
    'destinationCity': 'Barcelona',
    'destinationCountry': 'Spain',
    'carrierName': 'EasyJet',
    'departureDate': ''
  },
  'inboundFlight': {
    'originAirport': 'Barcelona (ABC)',
    'originId': 1234,
    'destinationAirport': 'London Stansted (STN)',
    'destinationCity': 'London',
    'destinationCountry': 'United Kingdom',
    'carrierName': 'EasyJet',
    'departureDate': ''
  },
  'price': 78
}

/* GET users listing. */
router.post('/', function(req, res, next) {
  // request.get(url,
  //   function(error, response, body) {
  //     if(!error && response.statusCode == 200) {
  //       organiseFlightResponse(JSON.parse(body));
  //     }
  //   });
  returnData.outboundFlight.departureDate = req.body.startDate;
  returnData.inboundFlight.departureDate = req.body.endDate;
  res.json(returnData);
});

var organiseFlightResponse = function(data) {
  let quotesArray = data.Quotes;
  let placesLookupArray = data.Places;
  let carriersLookupArray = data.Carriers;

  console.log('quotes: ', quotesArray, 'places: ', placesLookupArray, 'carriers: ', carriersLookupArray);
};

module.exports = router;
