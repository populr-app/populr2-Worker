
var Sequelize = require('sequelize');
var db = require('../connection');

module.exports = db.define('news', {
  fullName: { type: Sequelize.STRING, primaryKey: true }
}, { freezeTableName: true });
