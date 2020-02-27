
// webpack bakes supports-color - terminal color detection, so for now using source:
// const dlog = require('./node_modules/@genisense/dlog/src/app');

// tap into current source code:
const dlog = require('../../src/app')

const customLogger = (...args) => {

  const stackBreadCrumbs = dlog.formatters.stackBreadCrumbs(args)
  const logLineArr = dlog.formatters.colorizedSummary(args);
  console.log(...logLineArr, stackBreadCrumbs)

  const details = dlog.formatters.details(args)
  if (details) {
    const applicationStack = dlog.formatters.applicationStack(args)
    console.log('includeDetails : stack, data')
    console.log(applicationStack) // app stack
    console.dir(details[0]) // full param data
  }
};

const config = {
  include: ['*'],
  exclude: [],
  includeDetails: ['sanctum'],
  outputLogger: customLogger,
  globalLogger: 'd',
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