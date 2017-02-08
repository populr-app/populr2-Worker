
module.exports = require('rc')('populr', {
  worker: {
    log: 'error',
  },
  twitter: {
    consumer_key: 'Configure in .populrrc',
    consumer_secret: 'Configure in .populrrc',
    access_token_key: 'Configure in .populrrc',
    access_token_secret: 'Configure in .populrrc',
  },
});
