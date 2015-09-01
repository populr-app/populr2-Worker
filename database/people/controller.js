
import People from './model'

export function bulkCreate(array) {

  return People.bulkCreate(array)
    .then(()=> array)
}
