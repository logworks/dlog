const autodlog = require ('./../dlogger.js');

exports.namedOnExport = function(p1, p2) {
  autodlog.log({'namedOnExport': {p1 : p1, p2 : p2} }  , { arguments })
};

export default (p1, p2) => {
  autodlog.log({'TestComponent': {p1 : p1, p2 : p2} }  , { arguments })

  p3 = p1 + p2;
};
