
console.time('loadFromJson');

import {assign} from 'lodash';
import db from '../database/connection';
import * as People from '../database/people/controller';
import * as Context from '../database/context/controller';
import * as Twitter from '../database/twitter/controller';
import * as News from '../database/news/controller';
let data = require('../json/people.json');

export default function() {
  return db.sync({force: true})
    .then(() => data.map(personObj => {
      personObj = assign(personObj, personObj.context, personObj.twitter);
      delete personObj.context;
      delete personObj.twitter;
      return personObj;
    }))
    .then(People.bulkCreate)
    .then(Context.bulkCreate)
    .then(Twitter.bulkCreate)
    .then(News.bulkCreate)
    .then(() => console.timeEnd('loadFromJson'))
    .catch(e => console.log(e));
}
