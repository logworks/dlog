const callDiff = require('./callDiff.js');

const isObject = el => {
  return el instanceof Object && !Array.isArray(el);
};
const hasKeys = el => {
  return Object.keys(el).length >= 1;
};

const dlog = {
  logger: {
    config: {},

    log: function(logObj) {
      const { include, exclude, typeCheck } = this.config;
      const { timeStamp, file } = this.config.meta; // stack, level
      const meta = {};
      if (timeStamp) {
        meta.ts = new Date();
      }

      const logRoot = Object.keys(logObj);

      if (logRoot.length != 1 || !isObject(logObj[logRoot])) {
        const msg =
          '[dlog] Invalid log format.' +
          '\n  ' +
          'dlog takes an object with one key. ' +
          '\n  ' +
          'i.e: dlog.log( { somefunctionName : {param1, param2,...} } );' +
          '\n  ' +
          'but seems called as:    dlog.log ( ' +
          JSON.stringify(logObj) +
          ' );';
        throw new Error(msg);
      }
      const logKeyName = logRoot[0];

      const includeMatches = include.includes('*')
        ? ['one-length-array']
        : include.filter(item => {
            return item === logKeyName;
          });

      const excludeMatches = exclude.filter(item => {
        return item === logKeyName;
      });

      if (includeMatches.length === 1 && excludeMatches.length === 0) {
        const forcedErr = new Error();
        const chop = forcedErr.stack
          .split('\n')[2]
          .split('at ')[1]
          .split(':');
        const srcFile = chop[0];
        // const srcLine = chop[1];
        const parentLine = chop[2];

        if (file) {
          meta.file = srcFile;
        }

        if (typeCheck) {
          const diff = callDiff(file, parentLine, logObj);
          if (diff) {
            //  /x/ && config.typeDiffing on
            //  /x/ console.log('type diff:', JSON.stringify(diff))
          }
        }

        if (hasKeys(meta)) {
          console.log('[dlog]', logObj, meta);
        } else {
          console.log('[dlog]', logObj);
        }

        return logObj;
      }
    }
  },
  // todo:
  // enforce structure
  // configurable log.
  // default log all if filtrate empty
  createLogger: function(config) {
    this.logger.config = config;
    return this.logger;
  }
};

module.exports = dlog;
