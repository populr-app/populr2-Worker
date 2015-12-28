
import Sequelize from 'sequelize';
import db from '../connection';

export default db.define('context', {
  fullName: { type: Sequelize.STRING(190), primaryKey: true },
  occupation: { type: Sequelize.STRING },
  dob: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT }
}, { freezeTableName: true });
