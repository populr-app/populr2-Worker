
import Sequelize from 'sequelize';
let uri =  process.env.JAWSDB_URL || `mysql://root@localhost:3306/populr`;

export default new Sequelize(uri, {
  dialectOptions: {
    charset: 'utf8mb4'
  },
  logging: false,
});
