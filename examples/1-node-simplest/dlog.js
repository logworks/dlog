// const dlog = require('@genisense/dlog');
const dlog = require('../../src/app');

const customLogger = (...args) => {
  dlog.formatters.colorizedSummary(args);
};

const config = {
  include: ['*'],
  exclude: [],
  outputLogger: customLogger,
  globalLogger: 'd',
  timing: true,
  argCheck: false,
  file: false,
  typeCheck: false
};

const logger = dlog.createLogger(config);

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
