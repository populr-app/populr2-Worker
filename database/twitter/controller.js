
import Twitter from './model';

export function bulkCreate(array) {
  return Twitter.bulkCreate(array)
    .then(() => array);
}

export function bulkUpdate(array) {
  return Twitter.bulkCreate(array, {updateOnDuplicate: true})
    .then(() => array);
}

export function getAll() {
  return Twitter.findAll()
    .then(results => results.map(result => result.get()));
}

export function getMax() {
  var promiseArray = [];

  promiseArray.push(Twitter.max('followers'));
  promiseArray.push(Twitter.max('followersDelta'));

  return Promise.all(promiseArray);
}
