
console.time('dropDatabase')
import db from '../database/connection'
import People from '../database/people/model'
import Twitter from '../database/twitter/model'
import Context from '../database/context/model'
import News from '../database/news/model'

db.sync({force: true})
  .then(()=> {
    console.timeEnd('dropDatabase')
    process.exit(0)
  })
