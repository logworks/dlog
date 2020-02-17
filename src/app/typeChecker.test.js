const typeChecker = require('./typeChecker');
const _ = require('lodash');
const deepDiff = require('deep-diff');

describe('typeCheker objects ', () => {
  //todo - throw if param not obj
  //todo - throw if obj first level not single key

  it('types single nested empty object typing empty object as : "Object', () => {
    const inO = { fname: { a: { b: {} } } };
    const expectO = { fname: { a: { b: 'Object' } } };
    //const expectOwrapped = { wrapper: { types: expectO } }
    const outO = typeChecker(inO);
    expect(outO).toEqual(expectO);
  });

  //R:) Orange: String hard coded.
  it('types array content types e.g. propname: {Array: ["String"] } ', () => {
    const inO = { fname: { propname: [100, 's2'] } };
    const expectO = {
      fname: { propname: ['Numbers', 'Strings'] }
    };
    //const expectOwrapped = { wrapper: { types: expectO } }
    const outO = typeChecker(inO);
    expect(outO).toEqual(expectO);
  });

  it('types primatives', () => {
    const inO = {
      fname: {
        o1: {},
        s: '',
        n: 1,
        d: new Date(),
        o2: {},
        r: /x/,
        fn: a => {},
        o3: {},
        nully: null,
        undefinedly: undefined,
        truthly: true,
        falsly: false
        // symboly: 'todo',
        //bigInt64Arrayly: new BigInt64Array(99)(),
      }
    };
    const expectO = {
      fname: {
        o1: 'Object',
        s: 'String',
        n: 'Number',
        d: 'Date',
        o2: 'Object',
        r: 'RegExp',
        fn: 'Function',
        o3: 'Object',
        nully: 'Null',
        undefinedly: 'Undefined',
        truthly: 'Boolean',
        falsly: 'Boolean'
        //bigInt64Arrayly: 'BigInter',
        // symboly: 'todo',
      }
    };
    const outO = typeChecker(inO);
    expect(outO).toEqual(expectO);
  });

  // note x disabled too slow.
  // - check n perf. 10 secs for 2600 depth obj - prob needs to run on
  // log server process. at least copes better than recursion ;)
  xit('types deep nested objects', () => {
    const inO = require('./typeChecker.data.deep1'); //2600 nodes.
    const expectO = inO;
    const outO = typeChecker(inO);
    const diff = deepDiff(inO, outO);
    expect(diff).toBe(undefined);
    //who blew stack????? - toEqual did. prob uses recursion lol'
  });

  it('only types own properties, ignores prototypes', () => {
    function InO() {
      return { fname: { a: { b: {} } } };
    }
    InO.prototype.name = 'prototestname';
    const inO = new InO();

    const expectO = { fname: { a: { b: 'Object' } } };
    const outO = typeChecker(inO);
    expect(outO).toEqual(expectO);
  });

  // template:

  //     it('types ', () => {
  //         const inO = { a: { b: {} } }
  //         const expectO = { a: { b: 'Object' } }
  //         const expectOwrapped = { wrapper: { types: expectO } }
  //         const outO = typeChecker(inO)
  //         expect(outO).toEqual(expectOwrapped)
  //     })
});
