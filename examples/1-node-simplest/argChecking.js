const autodlog = require ('./dlogger.js');
/*
    example of config.argCheck = true.
    notifies if parameters recieved differs to named parameters.
*/
const argChecking = function() {
  function fnWithOptions(p1, options) {
  autodlog.log({'fnWithOptions': {p1 : p1, options : options} }  , { arguments })
  }

  fnWithOptions('single-param-with-options ok', {}); // wont log argCheck warning
  fnWithOptions('single-param-no-options'); //logs

  function fnWithMoreArgumentsThanNamedParams(p1) {
  autodlog.log({'fnWithMoreArgumentsThanNamedParams': {p1 : p1} }  , { arguments })
  }

  fnWithMoreArgumentsThanNamedParams('single-named-param ok'); // wont log argCheck warning
  fnWithMoreArgumentsThanNamedParams('more-args-than-named-params', 2, 3, 4, 5);
};

module.exports = argChecking;
