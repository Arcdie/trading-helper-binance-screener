module.exports = (async () => {
  require('./utils/set-env');
  await require('./utils/set-models')();

  require('../libs/redis');
  require('../libs/mongodb');

  const log = require('../libs/logger')(module);

  process.on('uncaughtException', (err) => {
    log.error(err);
    process.exit(1);
  });
});
