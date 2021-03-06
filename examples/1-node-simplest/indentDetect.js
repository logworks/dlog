const dlog = require ('./dlog.js');
function indentDetect() {
  const outerFn = p => {
    dlog.log( { 'outerFn' : {p} }, { arguments } )

    const innerFn = p => {
      dlog.log( { 'innerFn' : {p} }, { arguments } )

      return p;
    };
    const res = innerFn(p);
    return res;
  };
  outerFn(1);
}

module.exports = indentDetect;
