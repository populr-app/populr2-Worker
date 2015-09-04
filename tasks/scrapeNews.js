
console.time('scrapeNews');

import * as _ from 'lodash';
import * as News from '../database/news/controller';
import {writeFile} from 'fs';
import cheerio from 'cheerio';
import request from 'request';

let sites = require('../json/sites.json');
let html = '';

export default function() {
  return getAllHtml()
    .then(News.getAll)
    .then(countOccurences)
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

function countOccurences(names) {
  let counts = [];
  names.forEach(name => {
    let count = occurrences(html, name.fullName);
    if (count) counts.push({fullName: name.fullName, count: count});
  });
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

function requestP(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
}

function writeFileP(loc, data) {
  return new Promise((resolve, reject) => {
    writeFile(loc, data, function(err) {
      if (err) reject(err);
      else resolve(loc);
    });
  });
}
