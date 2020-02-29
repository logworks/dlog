const dlog = require ('./dlog.js');
const typCheckingExample = () => {
  dlog.log( { 'typCheckingExample' : {} }, { arguments } )

  const wantsAStringFn = function (str) {
  dlog.log( { 'function' : {str : str} }, { arguments } )

    return str;
  };

  wantsAStringFn('have a string');
  wantsAStringFn(['heres an array instead']);
};

module.exports = typCheckingExample;
