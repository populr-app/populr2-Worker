
import { Connection } from 'populr2-database';
import log from 'loggerlite';

export default function() {
  log.info(`${'dropDatabase'.magenta} Started...`);
  log.time('dropDatabase');

  return Connection.sync({ force: true })
    .then(() => log.info(`${'dropDatabase'.magenta} Complete in ${log.time('dropDatabase').green} seconds`))
    .catch(e => log.error(e));
}
