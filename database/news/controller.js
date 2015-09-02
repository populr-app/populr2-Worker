
var News = require('./model');

module.exports.bulkCreate = function(array) {
  return News.bulkCreate(array)
    .then(function() { return array; });
};

module.exports.getAll = function() {
  return News.findAll();
};
