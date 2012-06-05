var GooglePlaces = require('google-places');

var places = new GooglePlaces('YOUR_API_KEY');

places.search({keyword: 'Vermonster'}, function(err, response) {
  console.log(response.results);

  places.details({reference: response.results[0].reference}, function(err, response) {
    console.log(response.result.website);
  });

});
