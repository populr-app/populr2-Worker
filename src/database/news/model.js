
import Sequelize from 'sequelize';
import db from '../connection';

export default db.define('news', {
  fullName: { type: Sequelize.STRING(190), primaryKey: true },
  count: { type: Sequelize.INTEGER },
  countPeriodic: { type: Sequelize.TEXT('long') },
  countDelta: { type: Sequelize.INTEGER },
  countDeltaPeriodic: { type: Sequelize.TEXT('long') },
  score: { type: Sequelize.INTEGER },
  scoreDelta: { type: Sequelize.INTEGER }
}, { freezeTableName: true });
