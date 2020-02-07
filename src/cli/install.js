const path = require("path");
const cwd = path.resolve(process.cwd(), ".");
const readline = require("readline");
const utils = require("./utils");

/*
    target exits? yes: stop, 
    Web or Node (w/n) ? Answer - neither: stop
    Read file (w/n), write to target.
*/
async function installFactoryFile() {
  const WEB_FILE = "dlogger.web.js";
  const NODE_FILE = "dlogger.node.js";
  const LOG_FACTORY_FILE = "dlogger.js";

  const targetQuestion = `Logging for web or node app (w/n)? >`;

  try {
    const targetjs = await utils.readFile(cwd + "/" + LOG_FACTORY_FILE);
  } catch (e) {
    //target does not exist -proceed.

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(targetQuestion);
    let srcFactoryFile;

    for await (const line of rl) {
      const answer = line.toUpperCase();
      if (answer === "W") {
        srcFactoryFile = WEB_FILE;
      } else if (answer === "N") {
        srcFactoryFile = NODE_FILE;
      }
      break;
    }

    if (srcFactoryFile === undefined) return false;

    const srcjs = await utils.readFile(
      path.resolve(__dirname) + "/setup/" + srcFactoryFile
    );

    const targetWritten = await utils.writeFile(
      cwd + "/" + LOG_FACTORY_FILE,
      srcjs.data
    );

    console.log(`./${LOG_FACTORY_FILE} created.`);
    return true;
  }
}

async function installConfigFile() {
  const LOG_CONFIG_FILE = ".dlogrc";
  try {
    const targetjson = await utils.readFile(cwd + "/" + LOG_CONFIG_FILE);
    console.log(targetjson, "You already have ./" + LOG_CONFIG_FILE);
    return false;
  } catch (e) {
    //target does not exist - proceed
    utils
      .readFile(path.resolve(__dirname) + "/setup/" + LOG_CONFIG_FILE)
      .then(function(srcjson) {
        utils.writeFile(cwd + "/" + LOG_CONFIG_FILE, srcjson.data);
        console.log(`./${LOG_CONFIG_FILE} created.`);
        return true;
      });
  }
}

async function install() {
  const factoryFileComplete = await installFactoryFile();
  if (!factoryFileComplete) return false;
  const installConfigFileComplete = await installConfigFile();
  return factoryFileComplete && installConfigFileComplete;
}

module.exports = install;
