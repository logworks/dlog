/*
for testing locally only.
*/

const dlog = require('./src/app') //the delog installed with npm i @genisense/dlog

const configs = {
    core: {
        description: 'log application core',
        core: { filtrate: ['foo', 'mutantParams'] },
        all: { filtrate: ['*'] },
        none: { filtrate: [] },
    },
}

const config = configs.core.all //core;
const logger = dlog.createLogger(config)
console.log(config)

module.exports = logger
