
// webpack bakes supports-color - terminal color detection, so for now using source.
// const dlog = require('@genisense/dlog');

const dlog = require('./node_modules/@genisense/dlog/src/app');
const util = require('util') //util.inspect* example

/*
  When d.log() called, outputs to this function
  see config.outputLogger below.
  customise how you want, pass raw/formatted data on.
  
  util.inspect*
  useful for full depth object inspection.
  commented out - client dependency if you want to use it.
*/
const customLogger = (...args) => {

  const stackBreadCrumbs = dlog.formatters.stackBreadCrumbs(args)
  const logLineArr = dlog.formatters.colorizedSummary(args);
  console.log(...logLineArr, stackBreadCrumbs)

  const details = dlog.formatters.details(args)
  if (details) {
    const applicationStack = dlog.formatters.applicationStack(args)
    console.log('includeDetails : stack, data')
    // console.dir(applicationStack)
    console.log(util.inspect(applicationStack, false, null, true)) //util.inspect* example
    // console.dir(details[0])
    console.log(util.inspect(details[0], false, null, true)) //util.inspect* example

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