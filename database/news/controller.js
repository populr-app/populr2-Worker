
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

export function getMax() {
  var promiseArray = [];

  promiseArray.push(News.max('count'));
  promiseArray.push(News.max('countDelta'));

  return Promise.all(promiseArray);
}
