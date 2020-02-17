'use strict';
const callDiff = require('./callDiff.js');
const utils = require('./utils');
const argChecker = require('./argChecker');

const dlog = {
  logger: {
    config: {},

    log: function(logObj, meta) {
      const {
        include,
        exclude,
        typeCheck,
        outputLogger,
        argCheck
      } = this.config;
      const { timeStamp, file } = this.config.meta;
      const { isObject } = utils;

      const metaOut = {};

      if (timeStamp) {
        metaOut.ts = new Date();
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
          metaOut.file = srcFile;
        }

        if (typeCheck) {
          callDiff(file, parentLine, logObj);
        }

        outputLogger
          ? outputLogger(logObj, metaOut)
          : defaultOutputLogger(logObj, metaOut);

        if (argCheck && meta.arguments) {
          const argCheckMsg = argChecker(logObj, meta.arguments);
          if (argCheckMsg) {
            outputLogger
              ? outputLogger(argCheckMsg)
              : defaultOutputLogger(argCheckMsg);
          }
        }

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
