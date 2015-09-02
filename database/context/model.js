
var Sequelize = require('sequelize');
var db = require('../connection');

module.exports = db.define('context', {
  fullName: { type: Sequelize.STRING, primaryKey: true },
  occupation: { type: Sequelize.STRING },
  dob: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT }
}, { freezeTableName: true });
