
var Sequelize = require('sequelize');
var db = require('../connection');

module.exports = db.define('twitter', {
  fullName: { type: Sequelize.STRING, primaryKey: true },
  handle: { type: Sequelize.STRING },
  url: { type: Sequelize.STRING },
  avi: { type: Sequelize.STRING },
  followers: { type: Sequelize.INTEGER },
  followersDelta: { type: Sequelize.INTEGER }
}, { freezeTableName: true });
