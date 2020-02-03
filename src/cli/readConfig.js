const utils = require('./utils')
const path = require('path')
const cwd = path.resolve(process.cwd(), '.')

const readConfig = async function() {
    return new Promise(function(resolve, reject) {
        utils
            .readFile(cwd + '/dlog.config.json')
            .then(function(configJson) {
                //console.log(configJson, 'got config')
                const json = JSON.parse(configJson.data)
                if (!json['globPattern']) {
                    console.error(`
                ./dlog.config.json requires globPattern property.
                e.g.:
                {
                    "globPattern" : "src/**/*.js"
                }
        `)
                    process.exit()
                }
                resolve(json)
            })
            .catch(function(e) {
                console.error(
                    `Missing dlog.config.js. to create config run:\ndlog i`,
                    e
                )
                process.exit()
            })
    })
}

module.exports = readConfig
