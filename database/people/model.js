
import Sequelize from 'sequelize'
import db from '../connection'

export default db.define('people', {
  fullName: { type: Sequelize.STRING, primaryKey: true }
}, { freezeTableName: true })
