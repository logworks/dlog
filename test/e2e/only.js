const dlog = require ('./dlog.js');
module.exports = function (p1) {
  dlog.log( { 'only' : {p1 : p1} }, { defaultExport : 'only', arguments } )

}

module.exports = function () {
  dlog.log( { 'only' : {} }, { defaultExport : 'only', arguments } )

}

module.exports = () => {
  dlog.log( { 'only' : {} }, { defaultExport : 'only', arguments } )

}

module.exports = p1 => {
  dlog.log( { 'only' : {p1} }, { defaultExport : 'only', arguments } )

}

const notADefault = (p1) => {
  dlog.log( { 'notADefault' : {p1 : p1} }, { arguments } )
 }

export default () => {
  dlog.log( { 'only' : {} }, { defaultExport : 'only', arguments } )
 }

export default (p1) => {
  dlog.log( { 'only' : {p1 : p1} }, { defaultExport : 'only', arguments } )
 }

export default p1 => {
  dlog.log( { 'defaultp1' : {} }, { arguments } )

}