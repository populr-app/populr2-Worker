
import Context from './model';

export function bulkCreate(array) {
  return Context.bulkCreate(array)
    .then(() => array);
}

export function bulkUpdate(array) {
  return Context.bulkCreate(array, {updateOnDuplicate: true})
    .then(() => array);
}

export function getAll() {
  return Context.findAll()
    .then(results => results.map(result => result.get()));
}
