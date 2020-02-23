const dlog = require ('./../../src/dlog.js');
const TestComponentDir = require('./components/TestComponentDir');

const vanilla = function(p1, p2) {
  dlog.log( { 'vanilla' : {p1 : p1, p2 : p2} }, { arguments } )

  return p1 + p2;
};

vanilla(5, 6);
res = TestComponentDir(1, 2);
TestComponentDir(1, 2);
TestComponentDir(1, 2);

console.log('res', res);
