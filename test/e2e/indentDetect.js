function indentDetect() {
  const outerFn = p => {
    const innerFn = p => {

      const sanctum = p => {
        return p
      }

      sanctum({
        arr: [
          { a: [1, 2, 3, 4, 5] },
          new Date(),
          /x/,
          fn => () => { }]
      });
    };
    const res = innerFn(p);
    return res;
  };
  outerFn(1);
}

module.exports = indentDetect;
