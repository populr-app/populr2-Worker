
console.time('scrapeNews');

import * as _ from 'lodash';
import * as News from '../database/news/controller';
import cheerio from 'cheerio';
import request from 'request';

let sites = require('../json/sites.json');
let html = '';

export default function() {
  return getAllHtml()
    .then(News.getAll)
    .then(countOccurences)
    .then(News.bulkUpdate)
    .then(News.getMax)
    .then(calculateScores)
    .then(News.bulkUpdate)
    .then(() => console.timeEnd('scrapeNews'))
    .catch(e => console.log(e));
}

function getAllHtml() {
  let promiseArray = [];

  sites.forEach(url => {
    console.time(url);
    promiseArray.push(requestP(url)
      .then(body => {
        console.timeEnd(url);
        let $ = cheerio.load(body);
        let text = $('body').text();
        text = text.replace(/\s+/g, ' ');
        text = text.replace(/[^\w\s]/gi, '');
        html+= text;
      }).catch(e=>console.log(e)));
  });

  return Promise.all(promiseArray);
}

function countOccurences(people) {
  people.forEach(person => {
    let count = occurrences(html, person.fullName);
    person.countDelta = person.count !== null ? count - person.count : count;
    person.count = count;
  });
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
  return News.getAll()
    .then(results => results.map(result => {
      let c = result.count / maxs[0] || 0;
      let cd = result.countDelta / maxs[1] || 0;
      let score = Math.floor(((c + cd) / 2) * 1000);
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
