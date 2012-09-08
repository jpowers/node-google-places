# node-google-places

Google Places lib for [node.js](http://nodejs.org). Search, look up and autocomplete places via the Google Places API. This lib requires that you
have a Google API key. For more infor on the API check out the [Google Places API Docs](http://code.google.com/apis/maps/documentation/places/)

## Install

```
npm install google-places
```

## Usage
```js
var GooglePlaces = require('google-places');

var places = new GooglePlaces('YOUR_API_KEY');

places.search({keyword: 'Vermonster'}, function(err, response) {
  console.log("search: ", response.results);

  places.details({reference: response.results[0].reference}, function(err, response) {
    console.log("search details: ", response.result.website);
    // search details:  http://www.vermonster.com/
  });
});

places.autocomplete({input: 'Verm', types: "(cities)"}, function(err, response) {
  console.log("autocomplete: ", response.predictions);

  var success = function(err, response) {
    console.log("did you mean: ", response.result.name);
    // did you mean:  Vermont
    // did you mean:  Vermont South
    // did you mean:  Vermilion
    // did you mean:  Vermillion
  };

  for(var index in response.predictions) {
    places.details({reference: response.predictions[index].reference}, success);
  }
});
```

## Features
Currently search, autocomplete and details are supported. I hope to add checkin soon.

## Test

To test simply install development dependencies and run:

`vows test/* --spec`

## License

The MIT License (MIT)

Copyright (C) 2012 Vermonster LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

