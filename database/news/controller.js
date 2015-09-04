
import News from './model';

export function bulkCreate(array) {
  return News.bulkCreate(array)
    .then(() => array);
}

export function bulkUpdate(array) {
  return News.bulkCreate(array, {updateOnDuplicate: true})
    .then(() => array);
}

export function getAll() {
  return News.findAll()
    .then(results => results.map(result => result.get()));
}
