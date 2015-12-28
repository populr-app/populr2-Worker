
import { assign, chunk } from 'lodash';
import db from '../database/connection';
import * as People from '../database/people/controller';
import * as Context from '../database/context/controller';
import * as Twitter from '../database/twitter/controller';
import * as News from '../database/news/controller';
import { default as log } from 'loggerlite';

export default function() {
  log.info(`${'loadFromJson'.magenta} Started...`);
  log.time('loadFromJson');

  log.verbose(`${'loadFromJson'.magenta} Loading people.json`);
  let data = require('../../json/people.json');

  return db.sync({ force: true })
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
      return Promise.all(chunk(data, 2000).map(chunk => {
        return Context.bulkCreate(chunk);
      }));
    })
    .then(() => log.info(`${'loadFromJson'.magenta} Complete in ${log.time('loadFromJson').green} seconds`))
    .catch(e => log.error(e));
}
