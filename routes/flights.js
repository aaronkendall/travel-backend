'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

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

  quotesArray.forEach(function(quote) {
    returnObject.price = quote.MinPrice;
    returnObject.direct = quote.Direct;
    returnObject.quoteDate = quote.QuoteDateTime.split('T');

    returnObject.outboundFlight.destinationInfo = getDestinationPlaceData(quote.OutboundLeg, placesLookupArray);
    returnObject.outboundFlight.originInfo = getOriginPlaceData(quote.OutboundLeg, placesLookupArray);
    returnObject.outboundFlight.departureDate = quote.OutboundLeg.DepartureDate.split('T')[0];

    returnObject.inboundFlight.destinationInfo = getDestinationPlaceData(quote.InboundLeg, placesLookupArray);
    returnObject.inboundFlight.originInfo = getOriginPlaceData(quote.InboundLeg, placesLookupArray);
    returnObject.inboundFlight.departureDate = quote.InboundLeg.DepartureDate.split('T')[0];

    returnObject.outboundFlight.carrierInfo = getCarrierInfo(quote.OutboundLeg.CarrierIds, carriersLookupArray);
    returnObject.inboundFlight.carrierInfo = getCarrierInfo(quote.InboundLeg.CarrierIds, carriersLookupArray);

    returnData.push(returnObject);
  });
  return returnData;
};

const getDestinationPlaceData = function(quoteLeg, placeArray) {
  for (let i=0;  i<placeArray.length; i++) {
    if (placeArray[i].PlaceId == quoteLeg.DestinationId) {
      return placeArray[i];
    }
  }
};

const getOriginPlaceData = function(quoteLeg, placeArray) {
  for (let i=0;  i<placeArray.length; i++) {
    if (placeArray[i].PlaceId == quoteLeg.OriginId) {
      return placeArray[i];
    }
  }
};

const getCarrierInfo = function(carrierIdArray, carrierLookup) {
  let returnCarrierInfo = [];
  carrierIdArray.forEach(function(id) {
    for (let i=0; i<carrierLookup.length; i++) {
      if (carrierLookup[i].CarrierId == id) {
        returnCarrierInfo.push(carrierLookup[i]);
      }
    }
  });
  return returnCarrierInfo;
};

module.exports = router;
