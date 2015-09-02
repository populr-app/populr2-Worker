
var People = require('./model');

module.exports.bulkCreate = function(array) {
  return People.bulkCreate(array)
    .then(function() { return array; });
};

module.exports.getAll = function() {
  return People.findAll();
};
