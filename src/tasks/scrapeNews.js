
import { News } from 'populr2-database';
import cheerio from 'cheerio';
import request from 'request';
import log from 'loggerlite';

const sites = require('../../json/sites.json');
let html = '';

export default function() {
  log.info(`${'scrapeNews'.magenta} Started...`);
  log.time('scrapeNews');

  log.verbose(`${'scrapeNews'.magenta} Loading sites.json`);

  return getAllHtml()
    .then(News.getAll)
    .then(countOccurences)
    .then(News.bulkUpdate)
    .then(News.getMax)
    .then(calculateScores)
    .then(News.bulkUpdate)
    .then(() => log.info(`${'scrapeNews'.magenta} Complete in ${log.time('scrapeNews').green} seconds`))
    .catch(e => log.error(e));
}

function getAllHtml() {
  log.verbose(`${'scrapeNews'.magenta} Retrieving HTML`);
  log.time('retrieveHtml');
  let promiseArray = [];

  sites.forEach(url => {
    log.time(url);
    promiseArray.push(requestP(url)
      .then(body => {
        let $ = cheerio.load(body);
        let text = $('body').text();
        text = text.replace(/\s+/g, ' ');
        text = text.replace(/[^\w\s]/gi, '');
        html+= text;
        log.verbose(`${'scrapeNews'.magenta} Retrieved ${url.slice(7).green} in ${log.time(url).green} seconds`);
      }).catch(e => log.error(url, e)));
  });

  return Promise.all(promiseArray)
    .then(() => log.verbose(`${'scrapeNews'.magenta} HTML retrieved in ${log.time('retrieveHtml').green} seconds`));
}

function countOccurences(people) {
  log.verbose(`${'scrapeNews'.magenta} Counting occurences`);
  log.time('countOccurences');
  people.forEach(person => {
    const count = occurrences(html, person.fullName);
    person.countDelta = person.count !== null ? count - person.count : count;
    person.count = count;
  });
  log.verbose(`${'scrapeNews'.magenta} Occurrences counted in ${log.time('countOccurences').green} seconds`);
  return people;
}

function occurrences(string, subString, allowOverlapping){
  string+= ''; subString+= '';
  if (subString.length <= 0) return string.length+1;
  let n = 0, pos = 0;
  let step = allowOverlapping ? 1 : subString.length;
  while(true){
    pos = string.indexOf(subString,pos);
    if (pos >= 0) { n++; pos+= step; }
    else break;
  }
  return n;
}

function calculateScores(maxs) {
  log.verbose(`${'scrapeNews'.magenta} Calculating scores`);
  return News.getAll()
    .then(results => results.map(result => {
      const c = result.count / maxs[0] || 0;
      const cd = result.countDelta / maxs[1] || 0;
      const score = Math.floor(((c + cd) / 2) * 1000);
      if (result.score !== null) result.scoreDelta = score - result.score;
      result.score = score;
      return result;
    }));
}

function requestP(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
}
