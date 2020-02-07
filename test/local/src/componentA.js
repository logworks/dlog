const dlog = require("../dlogger.js");

const componentA = function() {
  tlog.log({
    globalLogging: {
      msg:
        "global logging - to save requiring into file before use, for manual logging."
    }
  });

  //*
  dlog.log({
    componentA: {
      msg:
        "dlog used for automated function logging (reoved and added with dlog cli"
    }
  });
  //*
};

module.exports = componentA;
