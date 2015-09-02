
var Context = require('./model');

module.exports.bulkCreate = function(array) {
  return Context.bulkCreate(array)
    .then(function() { return array; });
};

module.exports.getAll = function() {
  return Context.findAll();
};
