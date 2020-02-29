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
  variousTypesCount += 1 % (variousTypes.length - 1)
  return variousTypes[variousTypesCount]
}

const tick = (p1, delay) => {
  setTimeout(() => {
    tock(cycleVariousTypes(), delay - STEP);
  }, delay - STEP);
};

const tock = (p1, delay) => {
  if (delay > 1) {
    setTimeout(() => {
      tick(cycleVariousTypes(), delay - STEP);
    }, delay - STEP);
  }
};

const timing = () => {
  // tick, followed tock, followed tick. 🌊
  tock(cycleVariousTypes(), 200);
};

module.exports = timing;
