// initialise logging early in app bootup
let dlogger;
const setupLogging = () => {
  const config = { filtrate: ["*"], globalLogger: "tlog" };
  dlogger = dlog.createLogger(config);
  console.log("instantiated once on first require/import.");
  console.log("can dlog.config ={} on fly to adjust");

  if (config.globalLogger) {
    window[config.globalLogger] = dlogger;
  }
};

const boot = () => {
  setupLogging();
  dlogger.log({
    componentA:
      "dlog used for automated function logging (reoved and added with dlog cli"
  });
  tlog.log({
    globalLogging:
      "tlog - temp, quick access (window.tlog) to save requiring into file before use, for manual logging."
  });
};

boot();
