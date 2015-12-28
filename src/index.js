
import { default as log } from 'loggerlite';

global.loggerlite.corePrefix = '['.cyan + 'populr'.magenta + ']'.cyan;
global.loggerlite.logLevel = 'info';

let sequence = process.argv.slice(2);
let possibilites = {
  dropDatabase: true,
  loadFromJson: true,
  updatePeople: true,
  scrapeTwitter: true,
  scrapeNews: true
};

if (!sequence.length) {
  log('Available Tasks:');
  log(Object.keys(possibilites));
  process.exit(0);
}
if (sequence[sequence.length - 1].slice(0,2) === '--') global.loggerlite.logLevel = sequence.pop().slice(2);
Promise.resolve()
  .then(() => {
    if (sequence.length > 1) {
      log.info(`${'Sequence'.magenta} Started...`);
      log.time('Sequence');
    }
  })
  .then(() => sequence.reduce((promise, task) => {
    return promise.then(result => {
      if (possibilites[task]) {
        return require(`./tasks/${task}`).default();
      } else {
        log.error(`Unknown task: ${task.green}`);
        return Promise.resolve();
      }
    });
  }, Promise.resolve()))
  .then(() => {
    if (sequence.length > 1) {
      log.info(`${'Sequence'.magenta} Complete in ${log.time('Sequence').green} seconds`);
    }
    process.exit(0);
  })
  .catch(e => log.error(e));
