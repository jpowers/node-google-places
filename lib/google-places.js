var https        = require('https'),
    _            = require('underscore'),
    url          = require('url');


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
    path: options.path
  };

  return this;
};



// Google place search
GooglePlaces.prototype.search = function(options, cb) {
     this.searchRequest('search', options, cb);
};

// Google place nearbySearch
GooglePlaces.prototype.nearbySearch = function(options, cb) {
    this.searchRequest('nearbysearch', options, cb);
};

// Handle building general - search api request
GooglePlaces.prototype.searchRequest = function(type, options, cb) {
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

    this._doRequest(this._generateUrl(options, type), cb);
};

GooglePlaces.prototype.autocomplete = function(options, cb) {
  options = _.defaults(options, {
    language: "en",
    sensor: false
  });

  this._doRequest(this._generateUrl(options, 'autocomplete'), cb);
};

// Google place photo
GooglePlaces.prototype.photo = function(options, cb) {
    // Set default max height or max width if not exist
    if (!options.maxHeight && !options.maxWidth){
        options.maxHeight = 400;
    }

    this._doRequest(this._generateUrl(options, 'photo'), cb);
};

// Google place details
GooglePlaces.prototype.details = function(options, cb) {
  options = _.defaults(options, {
    sensor: false,
    language: 'en'
  });

  this._doRequest(this._generateUrl(options, 'details'), cb);
};

// Run the request
GooglePlaces.prototype._doRequest = function(request_query, cb) {
  // Pass the requested URL as an object to the get request
  https.get(request_query, function(res) {
      var data = [];
      res
      .on('data', function(chunk) { data.push(chunk); })
      .on('end', function() {
          var dataBuff = data.join('').trim();
          var result;
          try {
            result = JSON.parse(dataBuff);
          } catch (exp) {
            result = {'status_code': 500, 'status_text': 'JSON Parse Failed'};
          }
          cb(null, result);
      });
  })
  .on('error', function(e) {
      cb(e);
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
