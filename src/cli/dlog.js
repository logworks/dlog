#!/usr/bin/env node
const parser = require("./parser");
const path = require("path");

const install = require("./install");
const gitCheck = require("./gitCheck");
const readConfig = require("./readConfig");

const cmd = process.argv[process.argv.length - 1];
const helpMessage = `help:
dlog
     v      version.  
     i      installs ./.dlogrc and ./dlogger.js. 
     +      add logging to source files according to .dlogrc settngs
     -      remove logging .
     ++     force add logging (skip's git status check)
     ?      checks for dlog statements in code. (useful for CI).
         `;
//  'dlog must be run from app root directory (has package.json and git initialised.)'

const boot = async function() {
  let config;

  switch (cmd) {
    case "-":
      console.log("- removing logs");
      config = await readConfig();
      parser.execute(config, false, true);
      break;
    //case "--": "remove global convenience logging tlog TODO"
    case "?":
      console.log("dlog ? checking for dlog statements in source code...");
      config = await readConfig();
      parser.execute(config, false, false, true);
      break;

    case "++":
      console.log("++  Add logging, skip git status check.");
      config = await readConfig();
      parser.execute(config, true);
      break;
    case "+":
      const proceed = await gitCheck();
      console.log("proceed", proceed);
      if (proceed) {
        config = await readConfig();
          console.log("config", config);
        console.log("+ adding logs");
        parser.execute(config, true);
      }
      break;
    case "v":
      const packagePath = path.resolve(__dirname) + "/../../package.json";
      const pjson = require(packagePath);
      console.log("dlog version: ", pjson.version);
      break;
    case "i":
      install();
      break;

    default:
      console.log(helpMessage);
  }
};

boot();
