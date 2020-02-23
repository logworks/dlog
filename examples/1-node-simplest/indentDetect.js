const autodlog = require('./dlog.js');
function indentDetect() {
  const outerFn = p => {
    autodlog.log({ outerFn: { p } }, { arguments });

    const innerFn = p => {
      autodlog.log({ innerFn: { p } }, { arguments });

      return p;
    };
    const res = innerFn(p);
    return res;
  };
  outerFn(1);
}

module.exports = indentDetect;
