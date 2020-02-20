'use strict';
const callDiff = require('./callDiff.js');
const utils = require('./utils');
const argChecker = require('./argChecker');
const ErrorStackParser = require('error-stack-parser');
const ms = require('ms');

let mostRecentTimeStamp;

const dlog = {
  logger: {
    config: {},

    log: function(logObj, meta) {
      const {
        include,
        exclude,
        typeCheck,
        outputLogger,
        argCheck,
        timing,
        file
      } = this.config;

      const { isObject, hasKeys } = utils;

      const metaOut = {};

      if (timing) {
        const current = new Date();
        if (mostRecentTimeStamp) {
          metaOut.timing = ms(Math.abs(current - mostRecentTimeStamp));
        }
        mostRecentTimeStamp = current;
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
        const errStack = ErrorStackParser.parse(forcedErr);

        const filePath = errStack[1].fileName + ':' + errStack[1].lineNumber;

        if (file) {
          metaOut.file = filePath;
        }
        if (hasKeys(metaOut)) {
          outputLogger
            ? outputLogger(logObj, metaOut)
            : defaultOutputLogger(logObj, metaOut);
        } else {
          outputLogger ? outputLogger(logObj) : defaultOutputLogger(logObj);
        }
        if (argCheck && meta && meta.arguments) {
          const argCheckMsg = argChecker(logObj, meta.arguments);
          if (argCheckMsg) {
            outputLogger
              ? outputLogger(argCheckMsg)
              : defaultOutputLogger(argCheckMsg);
          }
        }
        if (typeCheck) {
          const diffs = callDiff(filePath, logObj);
          if (diffs) {
            for (let diff of diffs) {
              const diffLine = `${diff.path.join('.')} expect: ${
                diff.lhs
              } received: ${diff.rhs}`;

              const typeAnomolyMsg = `[TypeCheck] ${diffLine}`;

              outputLogger
                ? outputLogger(typeAnomolyMsg)
                : defaultOutputLogger(typeAnomolyMsg);
            }
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
