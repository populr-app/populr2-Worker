
var Sequelize = require('sequelize');
var db = require('../connection');

module.exports = db.define('people', {
  fullName: { type: Sequelize.STRING, primaryKey: true }
}, { freezeTableName: true });
