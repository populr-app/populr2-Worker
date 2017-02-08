
const db = require('populr2-Database');

module.exports = () => {
  log.info('Dropping database tables');

  return db.connection.sync({ force: true })
    .then(() => log.info('Table Drop Complete'));
};
