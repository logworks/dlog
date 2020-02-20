const autodlog = require ('./dlogger.js');
const typCheckingExample = () => {
  const wantsAString = function(str) {
    autodlog.log( { 'wantsAString' : {str : str} }, { arguments } )

    return str;
  };

  wantsAString('have a string');
  wantsAString(['heres an array instead']);
};

module.exports = typCheckingExample;
