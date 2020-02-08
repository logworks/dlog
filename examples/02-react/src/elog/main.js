const dep1 = require("./dep1");

dep1("hello");

const elog = {
  log: function(logObj) {
    console.log("elog", logObj);
  }
};

global.elogger = elog.log;

module.exports = elog;
