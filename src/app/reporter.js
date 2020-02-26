'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const stack = {};

/*
    get report for info on stack.
    () no params - all/full summary.
    (file:line) - for one function. //hmm may need hash in log itsself to reference.
    first metric: hitCount
*/
const getReport = function () {
  const stackArray = Object.keys(stack).map(key => {
    return stack[key];
  });

  // most hit functions:
  const hitSorted = _.sortBy(stackArray, [o => o.hitCount])
    .reverse()
    .slice(0, 5);
  console.log('[dlog report]');

  console.log('Most frequently called functions:');
  const hitTable = {};
  hitSorted.forEach(item => {
    hitTable[item.functionName] = {
      hits: item.hitCount,
      'avg (ms)': item.timingAverage,
      'max (ms)': item.timingMax,
      'min (ms)': item.timingMin
    };
  });
  console.table(hitTable);

  //   hitSorted.forEach(item =>
  //     console.log(`${item.functionName}. ${item.hitCount} times.`)
  //   );

  // slowest functions:
  const timingSorted = _.sortBy(stackArray, [o => o.timingAverage])
    .reverse()
    .slice(0, 5);
  console.log('\n Slowest Functions (by Avg): ');

  const timingTable = {};
  timingSorted.forEach(item => {
    timingTable[item.functionName] = {
      hits: item.hitCount,
      'avg (ms)': item.timingAverage,
      'max (ms)': item.timingMax,
      'min (ms)': item.timingMin
    };
  });

  console.table(timingTable);
  // timingSorted.forEach(item => console.log(`(${ms(item.timingAverage)} ${ms(item.timingMax)} ${ms(item.timingMin)}) : ${item.functionName}. ${item.hitCount} times.`))

  // suggestions:
  // console.log('Suggestion: To quieten them down, type:')
  // console.log(`d.config.exclude = [...d.config.exclude, ...${JSON.stringify(mostHitFunctionNames)}]`)
  // console.log(`or add to dlog.js config exclude : ${JSON.stringify(mostHitFunctionNames)}`)
};

const setReport = function (fileAndLine, logObj, meta) {
  const hash = crypto
    .createHash('md5')
    .update(fileAndLine)
    .digest('hex');

  if (stack[hash]) {
    const hitCount = stack[hash].hitCount + 1;
    stack[hash].hitCount = hitCount;
    const timingMs = meta.timing;
    stack[hash].timingMax =
      timingMs > stack[hash].timingMax ? timingMs : stack[hash].timingMax;
    stack[hash].timingMin =
      timingMs < stack[hash].timingMin ? timingMs : stack[hash].timingMin;
    const average =
      stack[hash].timingAverage - stack[hash].timingAverage / hitCount;
    stack[hash].timingAverage = parseInt(average + timingMs / hitCount, 10);
  } else {
    const functionName = Object.keys(logObj)[0];
    stack[hash] = {
      hitCount: 1,
      fileAndLine,
      functionName,
    };
    if (meta && meta.timing) {
      stack[hash].timingAverage = meta.timing;
      stack[hash].timingMax = meta.timing;
      stack[hash].timingMin = meta.timing;
    }
  }
};

module.exports.getReport = getReport;
module.exports.setReport = setReport;
