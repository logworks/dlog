const dlog = require("./dlogger.js");

const componentA = function() {
  dlog.log({
    componentA: {
      msg:
        "dlog used for automated function logging (reoved and added with dlog cli"
    }
  });
  tlog.log({
    globalLogging: {
      msg:
        "global logging - to save requiring into file before use, for manual logging."
    }
  });
};

module.exports = componentA;
