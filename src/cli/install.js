const path = require('path');
const cwd = path.resolve(process.cwd(), '.');
const readline = require('readline');
const utils = require('./utils');

const MODULE_SPECIFICATIONS = {
  W: 'es2015',
  N: 'commonjs'
};

async function chooseModuleSpecification() {
  let answer;
  const targetQuestion = `Logging for Web (imports, es2015)  or node (requires, commonJs) app (w/n) ? >`;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  process.stdout.write(targetQuestion);

  for await (const line of rl) {
    answer = line.toUpperCase();
    break;
  }
  return MODULE_SPECIFICATIONS[answer];
}

async function installFactoryFile(moduleSpecification) {
  const DEST_FACTORY_FILE = 'dlog.js';

  try {
    await utils.readFile(cwd + '/' + DEST_FACTORY_FILE);
  } catch (e) {
    const srcjs = await utils.readFile(
      path.resolve(__dirname) + `/setup/dlog.body`
    );
    // wrap body according to moduleSpecification
    let head, foot;

    if (moduleSpecification === 'commonjs') {
      head = `
// webpack bakes supports-color - terminal color detection, so for now using source.
// const dlog = require('@genisense/dlog');\n
const dlog = require('./node_modules/@genisense/dlog/src/app');\n`
      foot =
        `
process.on('exit', () => {
  logger.r()
})

module.exports = logger;`
    }
    if (moduleSpecification === 'es2015') {
      head = `import dlog from '@genisense/dlog';\n`
      foot = `\nexport default logger;`
    }
    const destjs = head + srcjs.data + foot;

    await utils.writeFile(cwd + '/' + DEST_FACTORY_FILE, destjs);

    process.stdout.write(`\n./${DEST_FACTORY_FILE} created.`);
    return true;
  }
}

async function installConfigFile(moduleSpecification) {
  const LOG_CONFIG_FILE = '.dlogrc';
  try {
    const targetjson = await utils.readFile(cwd + '/' + LOG_CONFIG_FILE);
    process.stdout.write('\n' + targetjson, 'You already have ./' + LOG_CONFIG_FILE);
    return false;
  } catch (e) {
    utils
      .readFile(path.resolve(__dirname) + '/setup/' + LOG_CONFIG_FILE)
      .then(function (srcjson) {
        //
        let config = JSON.parse(srcjson.data);
        config.module = moduleSpecification;
        utils.writeFile(
          cwd + '/' + LOG_CONFIG_FILE,
          JSON.stringify(config, undefined, 2)
        );
        process.stdout.write(`\n./${LOG_CONFIG_FILE} created.`);
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
