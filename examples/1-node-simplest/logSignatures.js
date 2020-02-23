const autodlog = require ('./dlog.js');



exports.dotExportedFnArrow = (p1, p2) => {
    autodlog.log( { 'dotExportedFnArrow' : {p1 : p1, p2 : p2} }, { arguments } )
}

exports.dotExportedFnA = function (p1, p2) {
    autodlog.log( { 'dotExportedFnA' : {p1 : p1, p2 : p2} }, { arguments } )
}

export default () => {
    return
}