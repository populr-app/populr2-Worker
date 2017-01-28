
const TwitterApi = require('twitter');
const _ = require('lodash');

const client = new TwitterApi(config.twitter);
const people = [
  { id: '822215679726100480' },
  { id: '17919972' },
  { id: '27260086' },
];

module.exports = () => {
  return getUsers()
    .then(splitIntoChunks)
    .then(getTwitterData)
    .then(updatePeople);
};

function getUsers() {
  return Promise.resolve(people);
}

function splitIntoChunks(users) {
  return _.chunk(users, 1);
}

function getTwitterData(chunks) {
  const promiseArray = [];

  chunks.forEach((chunk) => {
    const ids = _.map(chunk, 'id').join();
    promiseArray.push(client.get('users/lookup', { user_id: ids }));
  });

  return Promise.all(promiseArray)
    .then(results => _.flatten(results));
}

function updatePeople(results) {
  console.log(results);
}
