
let Sequelize = require('sequelize');
let db = require('../connection');

export default db.define('news', {
  fullName: { type: Sequelize.STRING, primaryKey: true }
}, { freezeTableName: true });
