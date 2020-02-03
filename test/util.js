const _ = require('lodash')
const deepMockObject = function(levels) {
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    deepObj = {}
    path = []
    for (let i = 1; i < levels; i++) {
        for (l of alphabet) {
            path.push([l + i])
            _.set(deepObj, path, { s: 'String' })
        }
    }
    return JSON.stringify(deepObj)
}

module.exports = { deepMockObject }
