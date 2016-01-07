
import { assign, chunk } from 'lodash';
import { Connection, People, Context, Twitter, News } from 'populr2-database';
import log from 'loggerlite';

export default function() {
  log.info(`${'loadFromJson'.magenta} Started...`);
  log.time('loadFromJson');

  log.verbose(`${'loadFromJson'.magenta} Loading people.json`);
  const data = require('../../json/people.json');

  return Connection.sync({ force: true })
    .then(() => data.map(personObj => {
      log.verbose(`${'loadFromJson'.magenta} Preparing data for ${personObj.fullName.green}`);
      personObj = assign(personObj, personObj.context, personObj.twitter);
      delete personObj.context;
      delete personObj.twitter;
      return personObj;
    }))
    .then(data => {
      log.verbose(`${'loadFromJson'.magenta} Placing into ${'People'.green} table`);
      return People.bulkCreate(data);
    })
    .then(data => {
      log.verbose(`${'loadFromJson'.magenta} Placing into ${'Twitter'.green} table`);
      return Twitter.bulkCreate(data);
    })
    .then(data => {
      log.verbose(`${'loadFromJson'.magenta} Placing into ${'News'.green} table`);
      return News.bulkCreate(data);
    })
    .then(data => {
      log.verbose(`${'loadFromJson'.magenta} Placing into ${'Context'.green} table`);
      return Promise.all(chunk(data, 2000).map(peopleChunk => {
        return Context.bulkCreate(peopleChunk);
      }));
    })
    .then(() => log.info(`${'loadFromJson'.magenta} Complete in ${log.time('loadFromJson').green} seconds`))
    .catch(e => log.error(e));
}
