#!/usr/bin/env node
const parser = require('./parser')
const path = require('path')
const utils = require('./utils')

const cwd = path.resolve(process.cwd(), '.')

const gitCheck = require('./gitCheck')
const readConfig = require('./readConfig')

const cmd = process.argv[process.argv.length - 1]

const boot = async function() {
    let config

    switch (cmd) {
        case '-':
            console.log('- removing logs')
            config = await readConfig()
            parser.execute(config, false, true)
            break

        case '?':
            console.log('dlog ? checking for dlog statements in source code...')
            config = await readConfig()
            parser.execute(config, false, false, true)
            break

        case '+f':
            console.log('+f force add logging')
            config = await readConfig()
            // console.log('config', config)
            // console.log('+ adding logs')
            parser.execute(config, true)
            break
        case '+':
            const proceed = await gitCheck()
            console.log('proceed', proceed)
            if (proceed) {
                config = await readConfig()
                console.log('config', config)
                console.log('+ adding logs')
                parser.execute(config, true)
            }

            break
        case 'v':
            const packagePath = path.resolve(__dirname) + '/../../package.json'
            const pjson = require(packagePath)
            console.log('dlog version: ', pjson.version)
            break
        case 'i':
            utils
                .readFile(cwd + '/dlog.js')
                .then(function(targetjs) {
                    console.log('You already have ./dlog.js')
                })
                .catch(function(e) {
                    utils
                        .readFile(path.resolve(__dirname) + '/setup/dlog.js')
                        .then(function(srcjs) {
                            utils.writeFile(cwd + '/dlog.js', srcjs.data)
                            console.log(`./dlog.js created.`)

                            //dlog.js done, now json
                            utils
                                .readFile(cwd + '/dlog.config.json')
                                .then(function(targetjson) {
                                    console.log(
                                        targetjson,
                                        'You already have ./dlog.config.js'
                                    )
                                })
                                .catch(function(e) {
                                    utils
                                        .readFile(
                                            path.resolve(__dirname) +
                                                '/setup/dlog.config.json'
                                        )
                                        .then(function(srcjson) {
                                            utils.writeFile(
                                                cwd + '/dlog.config.json',
                                                srcjson.data
                                            )
                                            console.log(
                                                `./dlog.configs.js created.`
                                            )
                                        })
                                })
                        })
                })
            break
        default:
            console.log(
                `commands:
                  v     dlog version number.  
                  i      install dlog config.json and standard logger.
                  +      add logging to source files based on confg.json
                  -      remove logging 
                  ?      checks for dlog statements in code. (useful for CI)
                 `
            )
    }
}

utils
    .readFile(cwd + '/.git/config')
    .then(res => {
        boot()
    })
    .catch(e => {
        console.log(
            'dlog must be run from app root directory (has package.json and git initialised.)'
        )
    })
