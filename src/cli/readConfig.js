const utils = require("./utils");
const path = require("path");
const cwd = path.resolve(process.cwd(), ".");

const CONFIG_FILE = ".dlogrc";

const readConfig = async function() {
  return new Promise(function(resolve, reject) {
    utils
      .readFile(cwd + "/" + CONFIG_FILE)
      .then(function(configJson) {
        const json = JSON.parse(configJson.data);
        if (!json["globPattern"]) {
          console.error(`
                ./${CONFIG_FILE} requires globPattern property.
                e.g.:
                {
                    "globPattern" : "src/**/*.js"
                }
        `);
          process.exit();
        }
        resolve(json);
      })
      .catch(function(e) {
        console.error(
          `Missing ${CONFIG_FILE}. to create config run:\ndlog i`,
          e
        );
        process.exit();
      });
  });
};

module.exports = readConfig;
