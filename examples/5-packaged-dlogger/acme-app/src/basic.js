const dlog = require('acme-dlogger-node');

const basic = function(p1) {
  dlog.log({ basic: { p1: p1 } });
  let x = 1 + 2;
};

module.exports = basic;
