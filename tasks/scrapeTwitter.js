
console.time('scrapeTwitter');

import * as _ from 'lodash';
import twitterApi from 'twitter';
import * as Twitter from '../database/twitter/controller';

let twitterClient = new twitterApi({
  consumer_key: 'FJBhQkiX2u9YktlqZwjwbdPyL',
  consumer_secret: 'ursyON7h1sw3oz6E17sPSxe59nE0MVhUyjnD5dvTANjRWV16cQ',
  access_token_key: '2659317550-PrW3k7aoK6M6tIRASIrtph5Jbqzgwi5YmZQU4vM',
  access_token_secret: '1NQAqS6hxuLisJ6AHYTVPJmmWuhy3Y12iWRhWBdpMZ5bp'
});

export default function() {
  return Twitter.getAll()
    .then(results => _.chunk(results, 100))
    .then(getTwitterData)
    .then(results => _.flatten(results))
    .then(Twitter.bulkUpdate)
    .then(Twitter.getMax)
    .then(calculateScores)
    .then(Twitter.bulkUpdate)
    .then(() => console.timeEnd('scrapeTwitter'));
}

function getTwitterData(chunks) {
  let promiseArray = [];

  chunks.forEach(chunkArray => {
    let chunkString = _.pluck(chunkArray, 'handle').join();
    let chunkObject = _.indexBy(chunkArray, obj => obj.handle.toLowerCase());

    promiseArray.push(twitterRequest('users/lookup', {screen_name: chunkString})
      .then(processTwitterData(chunkObject)));
  });

  return Promise.all(promiseArray);
}

function processTwitterData(chunkObject) {
  return function(twitterResults) {
    return twitterResults.map(twitterResult => {
      let oldData = chunkObject[twitterResult.screen_name.toLowerCase()];
      return {
        fullName: oldData.fullName,
        handle: twitterResult.screen_name,
        url: twitterResult.url,
        followers: twitterResult.followers_count,
        followersDelta: (oldData.followers !== null) ? twitterResult.followers_count - oldData.followers : twitterResult.followers_count,
        avi: twitterResult.profile_image_url
      };
    });
  };
}

function calculateScores(maxs) {
  return Twitter.getAll()
    .then(results => results.map(result => {
      let f = result.followers / maxs[0] || 0;
      let fd = result.followersDelta / maxs[1] || 0;
      let score = Math.floor(((f + fd) / 2) * 1000);
      if (result.score !== null) result.scoreDelta = score - result.score;
      result.score = score;
      return result;
    }));
}

function twitterRequest(...args) {
  return new Promise((resolve, reject) => {
    twitterClient.get(...args, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}
