const dlog = require ('./dlog.js');

const basic = function () {
  dlog.log( { 'function' : {} }, { arguments } )

  d.log({
    globalLogging: {
      msg:
        'global logging - to save requiring into file before use, for manual logging.'
    }
  });
};

module.exports = basic;
