
console.time('loadFromJson');

var _ = require('lodash');
var db = require('../database/connection');
var People = require('../database/people/controller');
var Context = require('../database/context/controller');
var Twitter = require('../database/twitter/controller');
var News = require('../database/news/controller');
var data = require('../json/people.json').slice(0, 20);

module.exports = function() {
  return db.sync({force: true})
    .then(function() {

      data.forEach(function(personObj) {
        personObj = _.assign(personObj, personObj.context, personObj.twitter);
        delete personObj.context;
        delete personObj.twitter;
      });

      return data;
    })
    .then(People.bulkCreate)
    .then(Context.bulkCreate)
    .then(Twitter.bulkCreate)
    .then(News.bulkCreate)
    .then(function() {
      console.timeEnd('loadFromJson');
    });
};
