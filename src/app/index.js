/*
    applies filtering.
    park call stack, remove callee approach completely.
*/

const callDiff = require("./callDiff.js");
/*

*/

const dlog = {
  logger: {
    config: {},

    log: function(logObj) {
      const matched =
        this.config.filtrate[0] === "*"
          ? "all"
          : config.filtrate.filter(item => {
              return item.match(fnCalled);
            });
      if (matched.length >= 1) {
        const params = [...Object.values(arguments)];
        const forcedErr = new Error();
        const chop = forcedErr.stack
          .split("\n")[2]
          .split("at ")[1]
          .split(":");
        const file = chop[0];
        const line = chop[1];
        const parentLine = chop[2];

        console.log(
          "data: ",
          JSON.stringify(params.length == 1 ? params[0] : params)
        );
        // console.log(params.length == 1 ? params[0] : params)
        const diff = callDiff(file, parentLine, logObj);
        if (diff) {
          // && config.typeDiffing on
          // console.log('type diff:', JSON.stringify(diff))
        }
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
