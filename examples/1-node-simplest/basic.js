const dlog = require('./dlogger');
const basic = function() {
  dlog.log({
    basic: {
      msg:
        'dlog used for automated function logging (reoved and added with dlog cli'
    }
  });
  tlog.log({
    globalLogging: {
      msg:
        'global logging - to save requiring into file before use, for manual logging.'
    }
  });
};

module.exports = basic;
