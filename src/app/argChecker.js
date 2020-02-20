/*
checks if count of named parameters differs to actual arguments passed.
logObj:  {fname: {p1,p2,}}
args:  { '0': 1, '1': 2, '3': 3 }  // conforms to js arguments interface.
*/
const argChecker = (logObj, args) => {
  const keys = Object.keys(logObj);
  let argArr = Object.values(args);
  let paramCount = 0;
  if (keys.length >= 1) {
    paramCount = Object.keys(logObj[keys[0]]).length;
  }
  if (paramCount !== argArr.length) {
    const message = `[ArgCheck] ${keys[0]}: ${paramCount} params : ${argArr.length} args. args: [${argArr}]`;
    return message;
  }
};

module.exports = argChecker;
