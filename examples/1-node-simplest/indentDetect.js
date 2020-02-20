function indentDetect() {
  const outer = p => {
    const inner = p => {
      return p;
    };
    const res = inner(p);
    return res;
  };
  outer(1);
}

module.exports = indentDetect;
