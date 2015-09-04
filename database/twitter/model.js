
let Sequelize = require('sequelize');
let db = require('../connection');

export default db.define('twitter', {
  fullName: { type: Sequelize.STRING, primaryKey: true },
  handle: { type: Sequelize.STRING },
  url: { type: Sequelize.STRING },
  avi: { type: Sequelize.STRING },
  followers: { type: Sequelize.INTEGER },
  followersDelta: { type: Sequelize.INTEGER },
  score: { type: Sequelize.INTEGER },
  scoreDelta: { type: Sequelize.INTEGER }
}, { freezeTableName: true });
