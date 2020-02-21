//const dlog = require('@genisense/dlog');
const dlog = require('../../src/app/');

const logHeadline = (args) => {
  const getType = elem => {
    return Object.prototype.toString.call(elem).slice(8, -1);
  };
  const fName = Object.keys(args[0])[0]
  const params = Object.keys(args[0][fName])

  const paramTypes = params.map((key) => key + ':' + getType(args[0][fName][key]))

  const timing = args[1].timing || ''
  const file = args[1].file || ''
  return (`[dlog][${timing}] ${fName} (${params}) (${paramTypes}) ${file}`)
}

const customLogger = (...args) => {
  console.log('_____', args)
  console.log(logHeadline(args))
  const fName = Object.keys(args[0])[0]
  const params = args[0][fName]
  console.log(params)
};

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'd',
  outputLogger: customLogger,
  argCheck: true,
  typeCheck: false,
  timing: true,
  file: false
};

const logger = dlog.createLogger(config);

/*
  to use globalLogger need to require this (dlog) early in application boot sequence e.g:
  require('../dlog.js')
  d.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

module.exports = logger;
