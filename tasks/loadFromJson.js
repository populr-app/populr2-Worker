
console.time('loadFromJson')
import db from '../database/connection'
import {assign} from 'lodash'
import * as People from '../database/people/controller'
import * as Context from '../database/context/controller'
import * as Twitter from '../database/twitter/controller'
import * as News from '../database/news/controller'

const data = require('../json/people.json')

db.sync({force: true})
  .then(()=> {
    data.forEach(function(personObj) {
      personObj = assign(personObj, personObj.context, personObj.twitter)
      delete personObj.context
      delete personObj.twitter
    });
    return data
  })
  .then(People.bulkCreate)
  .then(Context.bulkCreate)
  .then(Twitter.bulkCreate)
  .then(News.bulkCreate)
  .then(()=> {
    console.timeEnd('loadFromJson')
    process.exit(0)
  })
