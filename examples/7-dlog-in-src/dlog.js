const dlog = require('../../src/app');

const getType = elem => {
  return Object.prototype.toString.call(elem).slice(8, -1);
};

const logHeadline = args => {
  const fName = Object.keys(args[0])[0];
  const params = Object.keys(args[0][fName]);

  const paramTypes = params.map(
    key => key + ':' + getType(args[0][fName][key])
  );

  const timing = (args && args[1] && args[1].timing) || '';
  //const file = args[1].file || ''
  return `[dlog][${timing}] ${fName} (${params}) (${paramTypes})`;
};

const customLogger = (...args) => {
  console.log(logHeadline(args));
  const fName = Object.keys(args[0])[0];
  const params = args[0][fName];
  console.group();
  console.log(params);
  // console.dir(params)
  console.groupEnd();
};

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'd',
  outputLogger: customLogger,
  argCheck: true, //needs also to be set in .dlogrc before $ dlog + run. -or always add to meta.
  timing: true,
  file: false,
  typeCheck: true
};

const logger = dlog.createLogger(config);

/*
  d.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

console.log('dlog.config', logger.config);

process.on('exit', () => {
  logger.r();
});

module.exports = logger;
