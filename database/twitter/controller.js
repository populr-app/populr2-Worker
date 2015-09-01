
import Twitter from './model'

export function bulkCreate(array) {

  return Twitter.bulkCreate(array)
    .then(()=> array)
}
