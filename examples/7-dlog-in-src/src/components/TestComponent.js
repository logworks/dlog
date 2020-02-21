const dlog = require ('./../../dlog.js');

exports.namedOnExport = function(p1, p2) {
  dlog.log( { 'namedOnExport' : {p1 : p1, p2 : p2} }, { arguments } )
};

export default (p1, p2) => {
  dlog.log( { 'TestComponent' : {p1 : p1, p2 : p2} }, { arguments } )

  p3 = p1 + p2;
};
