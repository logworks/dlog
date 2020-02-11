'use strict';
const _ = require('lodash');

const getType = elem => {
  return Object.prototype.toString.call(elem).slice(8, -1);
};

function deepMapTypes(srcObject) {
  const target = {};
  const queue = [];
  const src = srcObject;
  let cursor = src;

  queue.push([...Object.keys(src)]);

  while (queue.length > 0) {
    let prop = queue.shift();
    cursor = _.get(src, prop);
    if (cursor) {
      let cursorType = getType(cursor);
      if (cursorType === 'Object') {
        var keys = Object.keys(cursor);
        if (keys.length) {
          keys.forEach(k => {
            queue.push(prop + '.' + k);
            let keyType = getType(cursor[k]);
            _.set(target, queue[queue.length - 1], keyType);
          });
        }
      } else {
        if (cursorType === 'Array') {
          let arrayTypes = {};
          for (let el of cursor) {
            let elType = getType(el) + 's';
            arrayTypes[elType] = null;
          }
          _.set(target, prop, Object.keys(arrayTypes));
        } else {
          _.set(target, prop, cursorType);
        }
      }
    }
  }
  return target;
}

module.exports = deepMapTypes;
