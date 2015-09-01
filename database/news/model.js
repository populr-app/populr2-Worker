
import Sequelize from 'sequelize'
import db from '../connection'

export default db.define('news', {
  fullName: { type: Sequelize.STRING, primaryKey: true }
}, { freezeTableName: true })
