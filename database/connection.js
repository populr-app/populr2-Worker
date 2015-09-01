
import Sequelize from 'sequelize'

const uri = 'postgres://localhost:5432/garrettcox'

export default new Sequelize(uri, { logging: false })
