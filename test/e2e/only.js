const dlog = require ('./dlog.js');

class ClassName {
  constructor(p1, p2) {
  dlog.log( { 'constructor' : {p1 : p1, p2 : p2} }, { arguments } )

    //
  }
  memberFunctionName() {
  dlog.log( { 'memberFunctionName' : {} }, { arguments } )

  }

  memberFunctionNameWithParams(p1) {
  dlog.log( { 'memberFunctionNameWithParams' : {p1 : p1} }, { arguments } )

  }

  memberArrowFunctionName = () => {
    dlog.log( { 'memberArrowFunctionName' : {} }, { arguments } )

    //
  }
}

module.exports = ClassName

// module.exports = function (p1) {
  dlog.log( { 'function' : {p1 : p1} }, { arguments } )

// }

// module.exports = function () {
  dlog.log( { 'function' : {} }, { arguments } )

// }

// module.exports = () => {
// }

// module.exports = p1 => {
// }

// const notADefault = (p1) => {//  }

// export default () => {//  }

// export default (p1) => {//  }

// export default p1 => {
// }