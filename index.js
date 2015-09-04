
let cmd = process.argv[2];
let possibilites = {
  'dropDatabase': true,
  'loadFromJson': true,
  'scrapeTwitter': true,
  'scrapeNews': true
};

if (possibilites[cmd]) require('./tasks/' + cmd)()
  .then(() => process.exit(0));
else console.log('Unknown task \'%s\'', cmd);
