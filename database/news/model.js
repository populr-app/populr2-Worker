
let Sequelize = require('sequelize');
let db = require('../connection');

export default db.define('news', {
  fullName: { type: Sequelize.STRING, primaryKey: true },
  count: { type: Sequelize.INTEGER },
  countDelta: { type: Sequelize.INTEGER },
  score: { type: Sequelize.INTEGER },
  scoreDelta: { type: Sequelize.INTEGER }
}, { freezeTableName: true });
