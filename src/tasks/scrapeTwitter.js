
import * as _ from 'lodash';
import twitterApi from 'twitter';
import { Twitter } from 'populr2-database';
import { default as log } from 'loggerlite';

let twitterClient = new twitterApi({
  consumer_key: process.env.TWITTERCK || require('../../local').twitter.consumer_key,
  consumer_secret: process.env.TWITTERCS || require('../../local').twitter.consumer_secret,
  access_token_key: process.env.TWITTERAK || require('../../local').twitter.access_token_key,
  access_token_secret: process.env.TWITTERAS || require('../../local').twitter.access_token_secret
});

export default function() {
  log.info(`${'scrapeTwitter'.magenta} Started...`);
  log.time('scrapeTwitter');

  return Twitter.getAll()
    .then(results => _.chunk(results, 100))
    .then(getTwitterData)
    .then(results => _.flatten(results))
    .then(Twitter.bulkUpdate)
    .then(Twitter.getMax)
    .then(calculateScores)
    .then(Twitter.bulkUpdate)
    .then(() => log.info(`${'scrapeTwitter'.magenta} Complete in ${log.time('scrapeTwitter').green} seconds`))
    .catch(e => log.error(e));
}

function getTwitterData(chunks) {
  let promiseArray = [];

  log.verbose(`${'scrapeTwitter'.magenta} Retrieving data from Twitter API`);
  log.time('twitterapi');
  chunks.forEach(chunkArray => {
    let chunkString = _.pluck(chunkArray, 'handle').join();
    let chunkObject = _.indexBy(chunkArray, obj => obj.handle.toLowerCase());

    promiseArray.push(twitterRequest('users/lookup', {screen_name: chunkString})
      .then(processTwitterData(chunkObject)));
  });

  return Promise.all(promiseArray)
    .then(data => {
      log.verbose(`${'scrapeTwitter'.magenta} Twitter data retrieved in ${log.time('twitterapi').green} seconds`);
      return data;
    });
}

function processTwitterData(chunkObject) {
  return function(twitterResults) {
    return twitterResults.map(twitterResult => {
      let oldData = chunkObject[twitterResult.screen_name.toLowerCase()];
      var newData = {};
      newData.fullName = oldData.fullName;
      newData.handle = twitterResult.screen_name;
      newData.followers = twitterResult.followers_count;
      newData.tweets = oldData.tweets !== null ? pushTweet(oldData.tweets, twitterResult.status) : pushTweet("[]", twitterResult.status);
      newData.followersPeriodic = oldData.followersPeriodic !== null ? pushToString(oldData.followersPeriodic, newData.followers) : "[]";
      newData.followersDelta = oldData.followers !== null ? twitterResult.followers_count - oldData.followers : 0;
      newData.followersDeltaPeriodic = oldData.followersDeltaPeriodic !== null ? pushToString(oldData.followersDeltaPeriodic, newData.followersDelta) : "[]";
      newData.avi = twitterResult.profile_image_url;
      return newData;
    });
  };
}

function calculateScores(maxs) {
  log.verbose(`${'scrapeTwitter'.magenta} Calculating scores`);
  return Twitter.getAll()
    .then(results => results.map(result => {
      let f = result.followers / maxs[0];
      let fd = result.followersDelta / maxs[1];
      let score = maxs[1] === 0 ? (f * 1000) : (((f + fd) / 2) * 1000);
      result.scoreDelta = result.score !== null ? score - result.score : 0;
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

function pushTweet(string, tweet) {
  if (!tweet) return string;
  var arr = JSON.parse(string);

  if (!_.find(arr, item => item.id === tweet.id)) {
    arr.push({
      created_at: tweet.created_at,
      id: tweet.id,
      text: tweet.text,
      source: tweet.source
    });
    if (arr.length > 5) arr.shift();
  }
  return JSON.stringify(arr);
}

function pushToString(string, val) {
  var arr = JSON.parse(string);
  arr.push(val);
  if (arr.length > 144) arr.shift();
  return JSON.stringify(arr);
}
