const dlog = require('./dlog.js');
const typCheckingExample = () => {
  const wantsAStringFn = function (str) {
    dlog.log({ 'wantsAStringFn': { str: str } }, { arguments })

    return str;
  };

  wantsAStringFn('have a string');
  wantsAStringFn(['heres an array instead']);
};

module.exports = typCheckingExample;
