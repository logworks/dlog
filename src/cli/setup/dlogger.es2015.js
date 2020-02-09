import dlog from '@genisense/dlog';
/*
  
  configure/ customise your runtime dlog.log here.

*/
const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  typeCheck: false,
  meta: {
    level: true,
    timeStamp: true,
    file: true,
    stack: true
  }
};

const logger = dlog.createLogger(config);

if (config.globalLogger) {
  window[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

export default logger;
