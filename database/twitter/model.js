
import Sequelize from 'sequelize'
import db from '../connection'

export default db.define('twitter', {
  fullName: { type: Sequelize.STRING, primaryKey: true },
  handle: { type: Sequelize.STRING },
  twitterId: { type: Sequelize.STRING }
}, { freezeTableName: true })
