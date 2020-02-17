const utils = require('./utils');
const path = require('path');
const cwd = path.resolve(process.cwd(), '.');

const CONFIG_FILE = '.dlogrc';

const readConfig = async function() {
  const ABSOLUTE_PATHED_CONFIG_FILE = cwd + '/' + CONFIG_FILE;
  try {
    const configJson = await utils.readFile(ABSOLUTE_PATHED_CONFIG_FILE);

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
  } catch (error) {
    console.log(
      `
      \nCould not read ${ABSOLUTE_PATHED_CONFIG_FILE}
      Have you ran 'dlog i'? It creates .dlogrc for you.
      ${error}`
    );
  }
  process.exit();
};

module.exports = readConfig;
