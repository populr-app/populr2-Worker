
const db = require('populr2-Database');

module.exports = () => {
  log.info('Dropping database tables');

  return db.connection.sync()
    .then(() => db.news.drop())
    .then(() => db.wiki.drop())
    .then(() => db.twitter.drop())
    .then(() => db.people.drop())
    .then(() => log.info('Table Drop Complete'));
};
