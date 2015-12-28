
import db from '../database/connection';
import People from '../database/people/model';
import Twitter from '../database/twitter/model';
import Context from '../database/context/model';
import News from '../database/news/model';
import { default as log } from 'loggerlite';

export default function() {
  log.info(`${'dropDatabase'.magenta} Started...`);
  log.time('dropDatabase');

  return db.sync({ force: true })
    .then(() => log.info(`${'dropDatabase'.magenta} Complete in ${log.time('dropDatabase').green} seconds`))
    .catch(e => log.error(e));
}
