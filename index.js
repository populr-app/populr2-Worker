
var cmd = process.argv[2];
var possibilites = {
  'dropDatabase': true,
  'loadFromJson': true,
  'scrapeTwitter': true
};

if (possibilites[cmd]) require('./tasks/' + cmd)()
  .then(function() {
    process.exit(0);
  });
else console.log('Unknown task \'%s\'', cmd);
