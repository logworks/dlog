const dlog = require ('./dlog.js');
const STEP = 20

variousTypes = [
  'astring',
  42, {}, [1, 2, 3, 4, 5],
  { a: [1, 2, 3, 4, 5] },
  new Date(),
  /x/,
  null,
  undefined,
  true,
  false,
  fn => () => { },
  'another string',
  {
    o: {
      a: {
        b: {
          c: {
            d: {
              e: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], f: [
                'astring',
                42, {}, [1, 2, 3, 4, 5],
                { a: [1, 2, 3, 4, 5] },
                new Date(),
                /x/,
                null,
                undefined,
                true,
                false,
                fn => () => { }]
            }
          }
        }
      }
    }
  }
]
let variousTypesCount = 0;

cycleVariousTypes = () => {
  dlog.log( { 'cycleVariousTypes' : {} }, { arguments } )

  variousTypesCount += 1 % (variousTypes.length - 1)
  return variousTypes[variousTypesCount]
}

const tick = (p1, delay) => {
  dlog.log( { 'tick' : {p1 : p1, delay : delay} }, { arguments } )

  setTimeout(() => {
    dlog.log( { 'setTimeout' : {} }, { arguments } )

    tock(cycleVariousTypes(), delay - STEP);
  }, delay - STEP);
};

const tock = (p1, delay) => {
  dlog.log( { 'tock' : {p1 : p1, delay : delay} }, { arguments } )

  if (delay > 1) {
    setTimeout(() => {
      dlog.log( { 'setTimeout' : {} }, { arguments } )

      tick(cycleVariousTypes(), delay - STEP);
    }, delay - STEP);
  }
};

const timing = () => {
  dlog.log( { 'timing' : {} }, { arguments } )

  // tick, followed tock, followed tick. 🌊
  tock(cycleVariousTypes(), 200);
};

module.exports = timing;
