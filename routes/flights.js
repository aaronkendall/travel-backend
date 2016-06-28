'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

// let returnObject = {
//   'outboundFlight': {
//     'originAirport': 'London Stansted (STN)',
//     'originId': 1234,
//     'destinationAirport': 'Barcelona (ABC)',
//     'destinationCity': 'Barcelona',
//     'destinationCountry': 'Spain',
//     'carrierName': 'EasyJet',
//     'departureDate': ''
//   },
//   'inboundFlight': {
//     'originAirport': 'Barcelona (ABC)',
//     'originId': 1234,
//     'destinationAirport': 'London Stansted (STN)',
//     'destinationCity': 'London',
//     'destinationCountry': 'United Kingdom',
//     'carrierName': 'EasyJet',
//     'departureDate': ''
//   },
//   'price': 78
// }

/* GET users listing. */
router.post('/', function(req, res, next) {
  const url = 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/UK/GBP/en-GB/' + req.body.origin + '/anywhere/' + req.body.startDate + '/' + req.body.endDate + '?apiKey=aa219678594276332752311136353209'
  request.get(url,
    function(error, response, body) {
      if(!error && response.statusCode == 200) {
        res.json(organiseFlightResponse(JSON.parse(body)));
      }
    });
});

const organiseFlightResponse = function(data) {
  let quotesArray = data.Quotes;
  let placesLookupArray = data.Places;
  let carriersLookupArray = data.Carriers;
  let returnObject = {
    "outboundFlight": {
      "destinationInfo": null,
      "originInfo": null,
      "departureDate": null
    },
    "inboundFlight": {
      "destinationInfo": null,
      "originInfo": null,
      "departureDate": null
    }
  };
  let returnData = [];

  quotesArray.map(function(quote) {
    returnObject.price = quote.MinPrice;
    returnObject.direct = quote.Direct;
    returnObject.quoteDate = quote.QuoteDateTime.split('T');

    returnObject.outboundFlight.destinationInfo = getDestinationPlaceData(quote.OutboundLeg, placesLookupArray);
    returnObject.outboundFlight.originInfo = getOriginPlaceData(quote.OutboundLeg, placesLookupArray);
    returnObject.outboundFlight.departureDate = quote.OutboundLeg.DepartureDate;

    returnObject.inboundFlight.destinationInfo = getDestinationPlaceData(quote.InboundLeg, placesLookupArray);
    returnObject.inboundFlight.originInfo = getOriginPlaceData(quote.InboundLeg, placesLookupArray);
    returnObject.inboundFlight.departureDate = quote.InboundLeg.DepartureDate;

    returnObject.outboundFlight.carrierInfo = getCarrierInfo(quote.OutboundLeg.CarrierIds, carriersLookupArray);
    returnObject.inboundFlight.carrierInfo = getCarrierInfo(quote.InboundLeg.CarrierIds, carriersLookupArray);

    returnData.push(returnObject);
  });
  return returnData;
};

const getDestinationPlaceData = function(quoteLeg, placeArray) {
  return placeArray.filter(function(place) {
    place.PlaceId == quoteLeg.DestinationId;
  });
};

const getOriginPlaceData = function(quoteLeg, placeArray) {
  return placeArray.filter(function(place) {
    place.PlaceId === quoteLeg.OriginId;
  });
};

const getCarrierInfo = function(carrierIdArray, carrierLookup) {
  let returnCarrierInfo = [];
  carrierIdArray.map(function(id) {
    returnCarrierInfo.push(
      carrierLookup.filter(function(carrier) {
        id === carrier.CarrierId;
      })
    )
  });
  return returnCarrierInfo;
};

module.exports = router;
