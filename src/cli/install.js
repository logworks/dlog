const path = require("path");
const cwd = path.resolve(process.cwd(), ".");
const readline = require("readline");
const utils = require("./utils");

const MODULE_SPECIFICATIONS = {
  W: "es2015",
  N: "commonjs"
};
/*
  choose module specification, 
  which is used to customise configuration files.
*/
async function chooseModuleSpecification() {
  let answer;
  const targetQuestion = `Logging for Web (imports, es2015)  or node (requires, commonJs) app (w/n) ? >`;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(targetQuestion);

  for await (const line of rl) {
    answer = line.toUpperCase();
    break;
  }
  return MODULE_SPECIFICATIONS[answer];
}

/*
    target exits? yes: stop, 
    Web or Node (w/n) ? Answer - neither: stop
    Read file (w/n), write to target.
*/
async function installFactoryFile(moduleSpecification) {
  const LOG_FACTORY_FILE = "dlogger.js";

  try {
    const targetjs = await utils.readFile(cwd + "/" + LOG_FACTORY_FILE);
  } catch (e) {
    //target does not exist -proceed. :( coding to negative

    const srcjs = await utils.readFile(
      path.resolve(__dirname) + `/setup/dlogger.${moduleSpecification}.js`
    );

    //todo catch, return.
    const targetWritten = await utils.writeFile(
      cwd + "/" + LOG_FACTORY_FILE,
      srcjs.data
    );

    console.log(`./${LOG_FACTORY_FILE} created.`);
    return true;
  }
}

async function installConfigFile(moduleSpecification) {
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
        //
        let config = JSON.parse(srcjson.data);
        config.module = moduleSpecification;
        utils.writeFile(
          cwd + "/" + LOG_CONFIG_FILE,
          JSON.stringify(config, undefined, 2)
        );
        console.log(`./${LOG_CONFIG_FILE} created.`);
        return true;
      });
  }
}

async function install() {
  const moduleSpecification = await chooseModuleSpecification();
  if (!moduleSpecification) return;
  const factoryFileComplete = await installFactoryFile(moduleSpecification);
  const installConfigFileComplete = await installConfigFile(
    moduleSpecification
  );
  return factoryFileComplete && installConfigFileComplete;
}

module.exports = install;
