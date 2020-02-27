'use strict';
const callDiff = require('./callDiff.js');
const utils = require('./utils');
const argChecker = require('./argChecker');
const ErrorStackParser = require('error-stack-parser');
const reporter = require('./reporter');
const colors = require('./color').colors;
const formatters = require('./formatters');

let mostRecentTimeStamp;

const dlog = {
  logger: {
    config: {},

    /*
    @param logObj
    @param metaObj
    @return via outputLogger(logObj, metaOut)
    */
    log: function (logObj, meta) {
      const {
        include,
        exclude,
        typeCheck,
        outputLogger,
        argCheck,
        file,
        stack
      } = this.config;

      const { isObject } = utils;

      const metaOut = {};

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

        const current = new Date();


        const fileAndLine = errStack[1].fileName + '_' + errStack[1].lineNumber;

        if (mostRecentTimeStamp) {
          metaOut.timing = Math.abs(current - mostRecentTimeStamp);
        } else {
          metaOut.timing = 1;
        }
        mostRecentTimeStamp = current;


        if (file) {
          metaOut.file = fileAndLine;
        }
        if (stack) {
          //todo - parse it down to parent function names within app.
          metaOut.stack = errStack
        }

        if (argCheck && meta && meta.arguments) {
          const argCheckMsg = argChecker(logObj, meta.arguments);
          if (argCheckMsg) {
            metaOut.argCheck = argCheckMsg;
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
              metaOut.typeCheck = typeAnomolyMsg;
            }
          }
        }
        reporter.setReport(fileAndLine, logObj, metaOut);
        outputLogger(logObj, metaOut)
      }
      //config include & exclude - does nothing. returns null for testing.
      return null
    },
    r: () => {
      return reporter.getReport();
    }
  },


  createLogger: function (config) {
    dlog.logger.config = config;
    formatters.setConfig(config)
    return dlog.logger;
  }
};

module.exports = {
  createLogger: dlog.createLogger,
  colors: colors,
  formatters: formatters
}
