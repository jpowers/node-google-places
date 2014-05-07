var _            = require('underscore'),
    url          = require('url'),
    request      = require('request');


var GooglePlaces = function(key, options) {
  // Set default options
  if (!options) options = {};
  options = _.defaults(options, {
    format: 'json',
    headers: { "User-Agent": 'Google-Places-Node' },
    host: 'maps.googleapis.com',
    port: 443,
    path: '/maps/api/place/'
  });

  this.config = {
    key: key,
    format: options.format,
    headers: options.headers,
    host: options.host,
    port: options.port,
    path: options.path,
    proxy: options.proxy
  };

  return this;
};

//Google place search
GooglePlaces.prototype.search = function(options, cb) {
  options = _.defaults(options, {
    location: [42.3577990, -71.0536364],
    radius: 10,
    sensor: false,
    language: 'en',
    rankby: 'prominence',
    types: []
  });
  
  options.location = options.location.join(',');

  if (options.types.length > 0) {
    options.types = options.types.join('|');
  } else {
    delete options.types;
  }
  if (options.rankby == 'distance')
    options.radius = null;
  
  this._doRequest(this._generateUrl(options, 'search'), cb);
};

GooglePlaces.prototype.autocomplete = function(options, cb) {
  options = _.defaults(options, {
    language: "en",
    sensor: false
  });

  this._doRequest(this._generateUrl(options, 'autocomplete'), cb);
};

// Goolge place details
GooglePlaces.prototype.details = function(options, cb) {
  options = _.defaults(options, {
    reference: options.reference,
    sensor: false,
    language: 'en'
  });

  this._doRequest(this._generateUrl(options, 'details'), cb);
};

// Run the request
GooglePlaces.prototype._doRequest = function(request_query, cb) {
  // Pass the requested URL as an object to the get request

  var requestOptions = {};
  requestOptions.url = request_query;
  if(this.config.proxy){
    requestOptions.proxy = this.config.proxy;
  }

  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      cb(null,data);
    }
    if(error){
      cb(error,null);
    }
  });

};

GooglePlaces.prototype._generateUrl = function(query, method) {
  //https://maps.googleapis.com/maps/api/place/search/json?
  _.compact(query); 
  query.key = this.config.key;
  return url.parse(url.format({
    protocol: 'https',
    hostname: this.config.host,
    pathname: this.config.path + method + '/' + this.config.format,
    query: query
  }));
};

module.exports = GooglePlaces;
