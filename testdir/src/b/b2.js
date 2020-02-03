const dlog = require('./../../../dlog.js')
function b2(complexObj) {
    dlog.log({ functionb2: { complexObj: complexObj } })

    return complexObj
}

module.exports = b2
