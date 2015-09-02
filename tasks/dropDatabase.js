
console.time('dropDatabase');

var db = require('../database/connection');
var People = require('../database/people/model');
var Twitter = require('../database/twitter/model');
var Context = require('../database/context/model');
var News = require('../database/news/model');

module.exports = function() {
  return db.sync({force: true})
    .then(function() {
      console.timeEnd('dropDatabase');
    });
};
