const _ = require('lodash');

const getType = elem => {
  return Object.prototype.toString.call(elem).slice(8, -1);
};

/*
    returns object of same structure as srcObject
    with values replaced by types.
  */
function deepMapTypes(srcObject) {
  const target = {};
  const queue = [];
  const src = srcObject; // assume (todo-check) srcObj is obj,with one top level key. { wrapper: { types: srcObject } } //todo -fix
  let cursor = src;

  queue.push([...Object.keys(src)]);

  while (queue.length > 0) {
    let prop = queue.shift();
    cursor = _.get(src, prop);
    if (cursor) {
      let cursorType = Object.prototype.toString.call(cursor).slice(8, -1);
      if (cursorType === 'Object') {
        var keys = Object.keys(cursor);
        if (keys.length) {
          keys.forEach(k => {
            queue.push(prop + '.' + k);
            let keyType = Object.prototype.toString
              .call(cursor[k])
              .slice(8, -1);
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
