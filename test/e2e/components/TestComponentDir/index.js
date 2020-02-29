const dlog = require ('./../../dlog.js');
export default (p1, p2) => {
  dlog.log( { 'TestComponentDir' : {p1 : p1, p2 : p2} }, { defaultExport : 'TestComponentDir', arguments } )
  //es2015
  p3 = p1 + p2;
};

module.exports = function () {
  dlog.log( { 'function' : {} }, { arguments } )

  //commonjs example
}


module.exports = (p1, p2) => {
  dlog.log( { 'TestComponentDir' : {p1 : p1, p2 : p2} }, { defaultExport : 'TestComponentDir', arguments } )

  //
}