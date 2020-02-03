const dlog = require('./../../dlog.js')
const b = require('./b/b')
const b2 = require('./b/b2')

const a = (s, n) => {
    dlog.log({ a: { s: s, n: n } })

    return s + 1
}

// a('str a', 1)
// a(new Date(), new Date())

// b('str b', 2)
//b2({ sib1: 'sib1 b2', sib2: 'sib1 b2' })

b2({ sib1: [1, 2] })
//b2({ sib1: ['1', '2'], sib2: 'sib1 b2' })
b2({
    sib1: ['1', new Date()],
})
