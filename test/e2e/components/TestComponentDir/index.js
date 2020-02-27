const dlog = require('./../../dlog.js');
export default (p1, p2) => {
  dlog.log({ 'TestComponentDir': { p1: p1, p2: p2 } }, { arguments })

  p3 = p1 + p2;
};
