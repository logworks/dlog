const typCheckingExample = () => {
  const wantsAString = function(str) {
    return str;
  };

  wantsAString('have a string');
  wantsAString(['heres an array instead']);
};

module.exports = typCheckingExample;
