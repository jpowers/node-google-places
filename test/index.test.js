var GooglePlaces = require('../lib/google-places'),
    vows = require('vows'),
    fakeweb = require('node-fakeweb'),
    assert = require('assert');

fakeweb.allowNetConnect = false;

// fake the search
fakeweb.registerUri({
  uri: 'https://maps.googleapis.com/maps/api/place/search/json?location=42.357799%2C-71.0536364&radius=10&sensor=false&language=en&&key=fake_key',
  body: '{"results" : [{"name": "Vermonster", "id":"1"}], "status" : "OK"}'
});
// fake the autocomplete
fakeweb.registerUri({
  uri: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?language=en&sensor=false&key=fake_key',
  body: '{"predictions" : [{"description": "Vermonster", "id":"1"}, {"description": "Vermont", "id":"2"}, {"description": "Vermilion", "id": "3"}], "status" : "OK"}'
});
//fake the details
fakeweb.registerUri({
  uri: 'https://maps.googleapis.com/maps/api/place/details/json?reference=ABC123&sensor=false&language=en&key=fake_key',
  body: '{"result" : {"rating": 2.5}, "status" : "OK"}'
});

vows.describe('Url generation').addBatch({
  'default url': {
    topic: new GooglePlaces('fake_key'),

    'should have a default url for place search': function(topic) {
      assert.equal(topic._generateUrl({}, 'search').href, 'https://maps.googleapis.com/maps/api/place/search/json?key=fake_key');
    },

    'should have a default url for place autocomplete': function(topic) {
      assert.equal(topic._generateUrl({}, 'autocomplete').href, 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=fake_key');
    },

    'should have my key as a query param': function(topic) {
      assert.equal(topic._generateUrl({key: 'fake_key'}, 'search').query, 'key=fake_key');
    }
  }
}).export(module);

vows.describe('Places search').addBatch({
  'new search': {
    topic: function() {
      new GooglePlaces('fake_key').search({}, this.callback);
    },

    'should not have an error': function(err, response){
      assert.isNull(err);
    },
    
    'should be status OK': function(err, response){
      assert.equal(response.status, 'OK');
    },

    'should include Vermonster': function(err, response){
      assert.equal(response.results[0].name, 'Vermonster');
    }
  }
}).export(module);

vows.describe('Places autocomplete').addBatch({
  'new autocomplete': {
    topic: function() {
      new GooglePlaces('fake_key').autocomplete({}, this.callback);
    },

    'should not have an error': function(err, response){
      assert.isNull(err);
    },
    
    'should be status OK': function(err, response){
      // console.log(response); process.exit();
      assert.equal(response.status, 'OK');
    },

    'should include Vermonster': function(err, response){
      assert.equal(response.predictions[0].description, 'Vermonster');
    }
  }
}).export(module);

vows.describe('Place details').addBatch({
  'new search': {
    topic: function() {
      new GooglePlaces('fake_key').details({reference: 'ABC123'}, this.callback);
    },
    'should get details': function(err, response){
      assert.equal(response.result.rating, 2.5);
    }
  }
}).export(module);
