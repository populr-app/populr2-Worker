
var Sequelize = require('sequelize');
var uri = 'postgres://localhost:5432/garrettcox';

module.exports = new Sequelize(uri, { logging: false });
