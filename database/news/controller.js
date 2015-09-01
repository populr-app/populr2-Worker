
import News from './model'

export function bulkCreate(array) {

  return News.bulkCreate(array)
    .then(()=> array)
}
