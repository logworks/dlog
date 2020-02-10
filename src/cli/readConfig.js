const utils = require('./utils');
const path = require('path');
const cwd = path.resolve(process.cwd(), '.');

const CONFIG_FILE = '.dlogrc';

const readConfig = async function() {
  try {
    const configJson = await utils.readFile(cwd + '/' + CONFIG_FILE);

    const config = JSON.parse(configJson.data);
    if (!config['globPattern']) {
      console.error(`
                ./${CONFIG_FILE} requires globPattern property.
                e.g.:
                {
                    "globPattern" : "src/**/*.js"
                }
        `);
      process.exit();
    }
    return config;
  } catch (e) {
    console.error(`
    Error, missing ./${CONFIG_FILE} file. 
    To create config run:\n dlog i`);
    process.exit();
  }
};

module.exports = readConfig;
