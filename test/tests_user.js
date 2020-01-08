const generateJSONExample = require('../utils/generate-json-excel');
const path = require('path');
var conf = require('config');
var should = require('chai').should(),
expect = require('chai').expect,
supertest = require('supertest'),
api = supertest(conf.url);
console.log(conf.url);

describe('User', function() {

  var items = [ '/user/list', '/status/list']; 
  items.forEach(function( value ) {
    it(value + ' should return a 200 response', function(done) {
        api.get(value)
        .set('Accept', 'application/json')
        .expect(401,done);
    });
  });
});
