<<<<<<< HEAD
=======
const dlog = require('./../../dlog.js')
>>>>>>> 55e0b6f59a5eab45533a28b9e82a159ce959829b
const b = require('./b/b')
const b2 = require('./b/b2')

const a = (s, n) => {
<<<<<<< HEAD
=======
    dlog.log({ a: { s: s, n: n } })

>>>>>>> 55e0b6f59a5eab45533a28b9e82a159ce959829b
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
