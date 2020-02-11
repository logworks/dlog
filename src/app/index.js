'use strict';
const callDiff = require('./callDiff.js');
const utils = require('./utils');

const dlog = {
  logger: {
    config: {},

    log: function(logObj) {
      const { include, exclude, typeCheck, outputLogger } = this.config;
      const { timeStamp, file } = this.config.meta;
      const { isObject, hasKeys } = utils;
      const meta = {};

      if (timeStamp) {
        meta.ts = new Date();
      }
      let defaultOutputLogger;
      if (outputLogger === undefined || typeof outputLogger !== 'function') {
        defaultOutputLogger = console.log;
      }
      const logRoot = Object.keys(logObj);

      if (logRoot.length != 1 || !isObject(logObj[logRoot])) {
        const msg = `[dlog] Invalid log format.
          dlog takes an object with one key. 
          i.e: dlog.log( { somefunctionName : {param1, param2,...} } );
          but seems called as:    
          dlog.log ( ${JSON.stringify(logObj)} )`;
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
          callDiff(file, parentLine, logObj);
        }

        if (hasKeys(meta)) {
          logObj.meta = meta;
        }
        outputLogger
          ? outputLogger('[dlog]', logObj)
          : defaultOutputLogger('[dlog]', logObj);

        return logObj;
      }
    }
  },

  createLogger: function(config) {
    this.logger.config = config;
    return this.logger;
  }
};

module.exports = dlog;
