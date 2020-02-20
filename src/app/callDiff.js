'use strict';
const crypto = require('crypto');
const deepDiff = require('deep-diff');
const _ = require('lodash');
const typeChecker = require('./typeChecker');

const stack = {};

const callDiff = function(file, params) {
  // console.log('callDiff', file, params);
  const hash = crypto
    .createHash('md5')
    .update(file)
    .digest('hex');

  let b = typeChecker(params);
  if (stack[hash]) {
    let a = stack[hash];
    let diffs = deepDiff(a, b);
    if (diffs) {
      for (let dif of diffs) {
        if (dif.kind === 'E') {
          const lhs = _.get(a, dif.path);
          _.set(a, dif.path, '!__' + lhs + '__!');
          const rhs = _.get(b, dif.path);
          _.set(b, dif.path, '!__' + rhs + '__!');
        }
        //todo
        // if (dif.kind === 'A') {
        //     const rhs = _.get(b, dif.path)
        //     _.set(
        //         b,
        //         [dif.path, [dif.index]],
        //         '+__' + rhs[dif.index] + '__+'
        //     )
        // }
      }
    }
    return diffs;
  } else {
    stack[hash] = b;
  }
};

module.exports = callDiff;
