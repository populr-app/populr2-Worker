
let Sequelize = require('sequelize');
let uri = 'mysql://root@localhost:3306/populr';

export default new Sequelize(uri, { logging: false });
