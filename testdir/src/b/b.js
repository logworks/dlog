<<<<<<< HEAD
const b = (s, n) => {
=======
const dlog = require('./../../../dlog.js');
const b = (s, n) => {
  dlog.log({'b': {s : s, n : n}})

>>>>>>> 55e0b6f59a5eab45533a28b9e82a159ce959829b
    return s + 1
}
module.exports = b
