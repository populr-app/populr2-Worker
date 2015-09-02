
console.time('scrapeTwitter');

var _ = require('lodash');
var bird = require('bluebird');
var twitterApi = require('twitter');
var Twitter = require('../database/twitter/controller');

bird.promisifyAll(twitterApi.prototype);

var client = new twitterApi({
  consumer_key: 'FJBhQkiX2u9YktlqZwjwbdPyL',
  consumer_secret: 'ursyON7h1sw3oz6E17sPSxe59nE0MVhUyjnD5dvTANjRWV16cQ',
  access_token_key: '2659317550-PrW3k7aoK6M6tIRASIrtph5Jbqzgwi5YmZQU4vM',
  access_token_secret: '1NQAqS6hxuLisJ6AHYTVPJmmWuhy3Y12iWRhWBdpMZ5bp'
});

module.exports = function() {
  return Twitter.getAll()
    .then(mapGet)
    .then(splitIntoChunks)
    .then(getTwitterData)
    .then(Twitter.getMax)
    .then(updateScores)
    .then(function() {
      console.timeEnd('scrapeTwitter');
    })
    .catch(e);
};

function mapGet(people) {
  return people.map(function(person) {
    return person.get();
  });
}

function splitIntoChunks(people) {
  return _.chunk(people, 100);
}

function getTwitterData(chunks) {
  var promiseArray = [];

  chunks.forEach(function(chunk) {
    var handles = _.pluck(chunk, 'handle').join();
    var peopleChunk = _.indexBy(chunk, function(obj) {
      return obj.handle.toLowerCase();
    });

    promiseArray.push(client.getAsync('users/lookup', {screen_name: handles})
      .then(updateTwitterData(peopleChunk)));
  });

  return bird.all(promiseArray);
}

function updateTwitterData(peopleChunk) {
  return function(twitterChunk) {
    var promiseArray = [];

    twitterChunk[0].forEach(function(twitterData) {
      var oldData = peopleChunk[twitterData.screen_name.toLowerCase()];
      console.log(oldData.followers);
      var newData = {
        fullName: oldData.fullName,
        handle: twitterData.screen_name,
        url: twitterData.url,
        followers: twitterData.followers_count,
        followersDelta: (oldData.followers !== null && oldData.followers !== undefined) ? twitterData.followers_count - oldData.followers : twitterData.followers_count,
        avi: twitterData.profile_image_url
      };

      promiseArray.push(Twitter.update(newData));
    });

    return bird.all(promiseArray);
  };
}

function updateScores(max) {
  console.log(max);
}

function e(err) {
  console.log(err);
}
