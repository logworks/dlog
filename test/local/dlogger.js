// direct link to local dlog:

const dlog = require("../../src/app");

// todo read config from .dlogrc.runtime
const config = { filtrate: ["*"], globalLogger: "tlog" };
const logger = dlog.createLogger(config);
// console.log("instantiated once on first require/import.");
// console.log("can dlog.config ={} on fly to adjust");
logger.log({ dlogger: { a: "a" } });
if (config.globalLogger) {
  global[config.globalLogger] = logger;
}

module.exports = logger;
