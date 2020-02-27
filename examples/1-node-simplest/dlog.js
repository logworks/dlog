
      // webpack bakes supports-color - terminal color detection, so for now using source.
      // const dlog = require('@genisense/dlog');

      const dlog = require('./node_modules/@genisense/dlog/src/app');

const customLogger = (...args) => {
  const logLineArr = dlog.formatters.colorizedSummary(args);
  console.log(...logLineArr)

  const details = dlog.formatters.details(args)
  if (details) {
    console.log(details[1]) //stack breadcrumbs
    console.dir(details[2]) // app stack
    console.dir(details[0]) // full param data
  }
};

const config = {
  include: ['*'],
  exclude: [],
  includeDetails: [],
  outputLogger: customLogger,
  globalLogger: 'd',
  timing: true,
  stack: true,
  file: false,
  argCheck: false,
  typeCheck: false
};

const logger = dlog.createLogger(config);
console.log('dlog config', logger.config)

/*
  example use:
  d.log({ someIndetifier: {p1, p2} }); 
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
}

process.on('exit', () => {
  logger.r()
})

module.exports = logger;