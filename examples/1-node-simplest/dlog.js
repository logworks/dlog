// const dlog = require('@genisense/dlog');
const dlog = require('../../src/app');

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'd',
  timing: true,
  argCheck: false, //Todo needs also to be set in .dlogrc before $ dlog + run. -or just always add arguments to meta.
  file: false,
  typeCheck: false
};

const logger = dlog.createLogger(config);

const customLogger = (...args) => {
  logger.formatters.devToolInColor(args);
  //now can pass raw log up to another log handler if want to.
};

logger.config.outputLogger = customLogger;

/*
  d.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
  // console.log('global ' + config.globalLogger + ' set.');
}

process.on('exit', () => {
  logger.r();
});

module.exports = logger;
