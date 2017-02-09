
const TwitterApi = require('twitter');
const _ = require('lodash');

const client = new TwitterApi(config.twitter);
const map = {};
const tops = {};

module.exports = () => {
  return db.connection.sync()
    .then(getUsers)
    .then(splitIntoChunks)
    .then(getTwitterData)
    .then(updatePeople)
    .then(findTops)
    .then(calculateScore)
    .catch(e => log.error(e));
};

function getUsers() {
  return db.twitter.findAll({ where: { handle: { $not: null } } });
}

function splitIntoChunks(users) {
  users.forEach(user => map[user.handle] = { old: user.get() });
  return _.chunk(users, 100);
}

function getTwitterData(chunks) {
  const promiseArray = [];

  chunks.forEach((chunk) => {
    const handles = _.map(chunk, 'handle').join();
    promiseArray.push(client.get('users/lookup', { screen_name: handles }));
  });

  return Promise.all(promiseArray)
    .then(results => _.flatten(results));
}

function updatePeople(results) {
  results.forEach((user) => {
    if (user.screen_name in map) {
      map[user.screen_name].new = {
        followers: user.followers_count,
        followersDelta: map[user.screen_name].old.followers === null ? 0 : user.followers_count - map[user.screen_name].old.followers,
      };
    }
  });

  return db.twitter.bulkCreate(Object.keys(map).map((k) => {
    return {
      id: map[k].old.id,
      followers: map[k].new.followers,
      followersDelta: map[k].new.followersDelta,
    };
  }), { updateOnDuplicate: ['id', 'followers', 'followersDelta', 'updatedAt'] });
}

function findTops() {
  return db.twitter.max('followers')
    .then(max => tops.followers = max)
    .then(() => db.twitter.max('followersDelta'))
    .then(max => tops.followersDelta = max)
    .then(() => {
      Object.keys(map).forEach((i) => {
        const user = map[i];
        if (user.old.followersDelta) {
          const percent = Math.floor((user.new.followersDelta / user.old.followersDelta) * 100);
          user.new.percent = percent;
          if (!tops.percent || percent > tops.percent) tops.percent = percent;
        }
      });
    });
}

function calculateScore() {
  return db.twitter.bulkCreate(Object.keys(map).map((k) => {
    const user = map[k];
    let score;

    const fS = Math.floor((user.new.followers / tops.followers) * 1000);
    const fdS = Math.floor((user.new.followersDelta / tops.followersDelta) * 1000);
    const pS = Math.floor((user.new.percent / tops.percent) * 1000);

    if (user.new.percent !== null && user.new.percent !== undefined) {
      score = (fS + fdS + pS) / 3;
    } else {
      score = fS;
    }

    return {
      id: user.old.id,
      score,
    };
  }), { updateOnDuplicate: ['id', 'score'] });
}
