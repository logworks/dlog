import dlog from './dlog.js';

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  outputLogger: console.dir,
  argCheck: true,
  timing: true,
  file: false,
  typeCheck: false
};

const logger = dlog.createLogger(config);
console.log('instantiated once on first require/import.');
console.log('can tlog.config ={} on fly to adjust');

if (config.globalLogger) {
  window[config.globalLogger] = logger;
}

export default logger;
