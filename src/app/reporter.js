'use strict';
const crypto = require('crypto');
const ms = require('ms');
const _ = require('lodash');

const stack = {};

/*
    get report for info on stack.
    () no params - all/full summary.
    (file:line) - for one function. //hmm may need hash in log itsself to reference.
    first metric: hitCount
*/
const getReport = function () {

    const stackArray = Object.keys(stack).map(key => { return stack[key]; });

    // most hit functions:
    const hitSorted = _.sortBy(stackArray, [o => o.hitCount]).reverse().slice(0, 5)
    console.log('[d.r()eport]')
    console.group()
    console.log('Top five most called functions:')
    hitSorted.forEach(item => console.log(`${item.functionName}. ${item.hitCount} times.`))


    // slowest functions:
    const timingSorted = _.sortBy(stackArray, [o => o.timingAverage]).reverse().slice(0, 5)
    console.log('\n(avg max min) Five Slowest Functions (avg): ')
    timingSorted.forEach(item => console.log(`(${ms(item.timingAverage)} ${ms(item.timingMax)} ${ms(item.timingMin)}) : ${item.functionName}. ${item.hitCount} times.`))
    console.groupEnd()

    // suggestions:
    // console.log('Suggestion: To quieten them down, type:')
    // console.log(`d.config.exclude = [...d.config.exclude, ...${JSON.stringify(mostHitFunctionNames)}]`)
    // console.log(`or add to dlog.js config exclude : ${JSON.stringify(mostHitFunctionNames)}`)

}

const setReport = function (fileAndLine, logObj, meta) {

    const hash = crypto
        .createHash('md5')
        .update(fileAndLine)
        .digest('hex');

    if (stack[hash]) {
        const hitCount = stack[hash].hitCount + 1
        stack[hash].hitCount = hitCount
        const timingMs = ms(meta.timing)
        stack[hash].timingMax = timingMs > stack[hash].timingMax ? timingMs : stack[hash].timingMax;
        stack[hash].timingMin = timingMs < stack[hash].timingMin ? timingMs : stack[hash].timingMin;
        const average = stack[hash].timingAverage - stack[hash].timingAverage / hitCount
        stack[hash].timingAverage = parseInt(average + (timingMs / hitCount), 10);

    } else {
        const functionName = Object.keys(logObj)[0]
        stack[hash] = {
            hitCount: 1,
            fileAndLine,
            functionName
        }
        if (meta && meta.timing) {
            stack[hash].timingAverage = ms(meta.timing)
            stack[hash].timingMax = ms(meta.timing)
            stack[hash].timingMin = ms(meta.timing)
        }
    }
}

module.exports.getReport = getReport;
module.exports.setReport = setReport;