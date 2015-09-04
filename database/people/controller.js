
import People from './model';

export function bulkCreate(array) {
  return People.bulkCreate(array)
    .then(() => array);
}

export function bulkUpdate(array) {
  return People.bulkCreate(array, {updateOnDuplicate: true})
    .then(() => array);
}

export function getAll() {
  return People.findAll()
    .then(results => results.map(result => result.get()));
}
