
import Sequelize from 'sequelize';
import db from '../connection';

export default db.define('twitter', {
  fullName: { type: Sequelize.STRING(190), primaryKey: true },
  handle: { type: Sequelize.STRING },
  avi: { type: Sequelize.STRING },
  followers: { type: Sequelize.INTEGER },
  followersPeriodic: { type: Sequelize.TEXT('long') },
  followersDelta: { type: Sequelize.INTEGER },
  followersDeltaPeriodic: { type: Sequelize.TEXT('long') },
  score: { type: Sequelize.INTEGER },
  scoreDelta: { type: Sequelize.INTEGER },
  tweets: { type: Sequelize.TEXT('long') }
}, { freezeTableName: true });
