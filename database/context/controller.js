
import Context from './model'

export function bulkCreate(array) {

  return Context.bulkCreate(array)
    .then(()=> array)
}
