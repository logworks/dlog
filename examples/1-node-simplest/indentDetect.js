const autodlog = require ('./dlogger.js');
function indentDetect() {
  const outer = p => {
    autodlog.log( { 'outer' : {p} }, { arguments } )

    const inner = p => {
      autodlog.log( { 'inner' : {p} }, { arguments } )

      return p;
    };
    const res = inner(p);
    return res;
  };
  outer(1);
}

module.exports = indentDetect;
