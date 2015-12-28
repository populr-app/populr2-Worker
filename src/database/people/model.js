
import Sequelize from 'sequelize';
import db from '../connection';

export default db.define('people', {
  fullName: { type: Sequelize.STRING(190), primaryKey: true }
}, { freezeTableName: true });
