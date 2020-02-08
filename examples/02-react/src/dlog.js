//browser version

import dlog from "./dlog"; //the delog installed with npm i @genisense/dlog

/*
    creates logger instance for application wide use and
    customisation.
    Note: cli adds const dlog = require('./../dlogger.js')
    when dlog --add is run. 
    so currently must keep the name dlogger.js (may make configurable later)

    pulls in configs. 
    configs allow you to keep multiple sets of filters. Why?
    filters are useful for showing map of execution to code for other developers
    (think code walktrhough), or God forbid -need to revisit to debug same sort of issue.
*/
const configs = {
  core: {
    description: "log application core",
    core: { filtrate: ["foo", "mutantParams"] },
    all: { filtrate: ["*"] },
    none: { filtrate: [] }
  }
};

const config = configs.core.all; //core;
const logger = dlog.createLogger(config);
console.log(config);

window.dlog = logger;

export default logger;
