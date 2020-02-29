const typCheckingExample = () => {
  const wantsAStringFn = function (str) {
    return str;
  };

  wantsAStringFn('have a string');
  wantsAStringFn(['heres an array instead']);
};

module.exports = typCheckingExample;
