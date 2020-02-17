import dlog from '@genisense/dlog';
import LogRocket from './node_modules/logrocket';
LogRocket.init('YOUR_PRIVATE_LOGROCKET_URI');

const config = {
  include: ['*'],
  exclude: [],
  // globalLogger: 'tlog',
  outputLogger: LogRocket.log,
  typeCheck: false,
  timing: true,
  file: true
};

const logger = dlog.createLogger(config);
/*
  to use globalLogger need to require this (dlogger) early in application boot sequence e.g:
  require('../dlogger.js')
  tlog.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  window[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

export default logger;
