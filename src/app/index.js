'use strict';
const callDiff = require('./callDiff.js');
const utils = require('./utils');
const argChecker = require('./argChecker');
const ErrorStackParser = require('error-stack-parser');
const ms = require('ms');
const reporter = require('./reporter');
const colors = require('./color').colors;
const formatters = require('./formatters');

let mostRecentTimeStamp;

const dlog = {
  logger: {
    config: {},

    log: function (logObj, meta) {
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
        } else {
          metaOut.timing = '0ms';
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

        const fileAndLine = errStack[1].fileName + ':' + errStack[1].lineNumber;

        if (file) {
          metaOut.file = fileAndLine;
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
            console.log(argCheckMsg);
          }
        }
        if (typeCheck) {
          const diffs = callDiff(fileAndLine, logObj);
          if (diffs) {
            for (let diff of diffs) {
              const diffLine = `${diff.path.join('.')} expect: ${
                diff.lhs
                } received: ${diff.rhs}`;

              const typeAnomolyMsg = `[dlog][TypeCheck] ${diffLine}`;
              console.log(typeAnomolyMsg);
            }
          }
        }
        reporter.setReport(fileAndLine, logObj, metaOut);
        return logObj;
      }
    },
    r: () => {
      return reporter.getReport();
    }
  },


  createLogger: function (config) {
    dlog.logger.config = config;
    return dlog.logger;
  }
};

module.exports = {
  //logger: dlog.logger,
  createLogger: dlog.createLogger,
  colors: colors,
  formatters: formatters
}
