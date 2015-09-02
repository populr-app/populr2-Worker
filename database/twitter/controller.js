
var Twitter = require('./model');
var bird = require('bluebird');

module.exports.bulkCreate = function(array) {
  return Twitter.bulkCreate(array)
    .then(function() { return array; });
};

module.exports.update = function(newData) {
  return Twitter.upsert(newData);
};

module.exports.getAll = function() {
  return Twitter.findAll();
};

module.exports.getMax = function() {
  var promiseArray = [];

  promiseArray.push(Twitter.max('followers'));
  promiseArray.push(Twitter.max('followersDelta'));

  return bird.all(promiseArray);
};
