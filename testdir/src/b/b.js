const dlog = require('./../../../dlog.js');
const b = (s, n) => {
  dlog.log({'b': {s : s, n : n}})

    return s + 1
}
module.exports = b
