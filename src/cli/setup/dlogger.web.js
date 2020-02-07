import dlog from "@genisense/dlog"; // copied from ../dist/dlog.js on npm run build

// todo read config from .dlogrc.runtime
const config = { filtrate: ["*"], globalLogger: "tlog" };
const logger = dlog.createLogger(config);
console.log("instantiated once on first require/import.");
console.log("can dlog.config ={} on fly to adjust");

if (config.globalLogger) {
  window[config.globalLogger] = logger;
}

export default logger;
