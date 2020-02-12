const dlog = require('./dlogger.js');

const componentA = function() {
  dlog.log(
    {
      componentA: {
        msg:
          'dlog used for automated function logging (reoved and added with dlog cli'
      }
    },
    { level: 'info' }
  );
};

module.exports = componentA;
