const argChecker = require('./argChecker');

describe('argChecker checks named parameters against actual arguments', () => {
  it('conforms to arguments array like object', () => {
    function fname(p1) {
      const res = argChecker({ fname: { p1 } }, arguments);
      expect(res).toBe(
        '[ArgCheck Warning] fname: 1 params : 3 args. args: [1,2,3]'
      );
    }
    fname(1, 2, 3);
  });

  it('returns undefined when no only named paramaters are passed in ', () => {
    function fname(p1) {
      const res = argChecker({ fname: { p1 } }, arguments);
      expect(res).toBe(undefined);
    }
    fname(1);
  });

  it('returns formatted message when count named params < count arguments', () => {
    const res = argChecker({ fname: { p1: 1 } }, { '0': 1, '1': 2, '3': 3 });
    expect(res).toBe(
      '[ArgCheck Warning] fname: 1 params : 3 args. args: [1,2,3]'
    );
  });

  // ? of interest, but common e.g not passing in optional params.
  // if keep this way, need suppression option, ideally with suggest feedback loop.
  it('returns formatted message when named paramaters > arguments', () => {
    function fname(p1, p2) {
      const res = argChecker({ fname: { p1, p2 } }, arguments);
      expect(res).toBe(
        '[ArgCheck Warning] fname: 2 params : 1 args. args: [1]'
      );
    }
    fname(1);
  });
});
