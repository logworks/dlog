//const dlog = require('../../dist/dlog.js');
const dlog = require('../../src/app/index.js');
const winstonLogger = require('./winstonLogger');

const winstonLoggerTransform = (data, meta) => {
  const winstonLog = {};
  winstonLog.message = JSON.stringify(data);
  if (meta && meta.level) winstonLog.level = meta.level;
  winstonLogger.log(winstonLog);
};

/*
  configure/ customise your runtime dlog.log here.
*/
const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  outputLogger: console.log, // winstonLoggerTransform,
  typeCheck: false,
  meta: {
    timeStamp: false,
    file: false
  }
};

const logger = dlog.createLogger(config);

module.exports = logger;
