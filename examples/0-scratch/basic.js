const dlog = require ('./dlog.js');

const basic = function (p1) {
  dlog.log( { 'basic' : {p1 : p1} } )

  const x = 1, y = 2;
  d.log({
    basicinternals: {
      msg:
        'manually added using global.d.log()',
      x, y
    }
  });
};

module.exports = basic;
