
require('./services')();
const available = require('./tasks')();

const tasks = process.argv.slice(2);

if (tasks.length) {
  Promise.resolve()
    .then(() => tasks.reduce((a, t) => a.then(() => {
      if (t in available) return available[t]();
      return Promise.reject(`Invalid task: ${t}`);
    }), Promise.resolve()))
    .catch(e => {
      log.error(e);
      help();
    })
    .then(() => process.exit());
} else help();

function help() {
  log();
  log('Tasks Available:');
  Object.keys(available).forEach(t => log('-', t.lYellow));
  log();
}
