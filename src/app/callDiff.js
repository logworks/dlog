const crypto = require("crypto");
const deepDiff = require("deep-diff");
const _ = require("lodash");
const typeChecker = require("./typeChecker");

/*
stack tracks hash of function calls (filename, line)
The param values are converted to type identifiers.
When subsequently called if the types vary, 
the logger provides the diff.

Note: 

to move to logging server when build one.

stack in memory, unmanaged - another reason to move to server,
remove from app perf, caching options like redis on server.

look for colorised diff for console:
jasmine / https://github.com/flitbit/diff ?

*/
const stack = {};

const callDiff = function(file, parentLine, params) {
  const hash = crypto
    .createHash("md5")
    .update(file + parentLine)
    .digest("hex");

  let b = typeChecker(params);
  if (stack[hash]) {
    let a = stack[hash];
    let diffs = deepDiff(a, b);
    if (diffs) {
      for (dif of diffs) {
        if (dif.kind === "E") {
          const lhs = _.get(a, dif.path);
          _.set(a, dif.path, "!__" + lhs + "__!");
          const rhs = _.get(b, dif.path);
          _.set(b, dif.path, "!__" + rhs + "__!");
        }
        //todo
        // if (dif.kind === 'A') {
        //     const rhs = _.get(b, dif.path)
        //     _.set(
        //         b,
        //         [dif.path, [dif.index]],
        //         '+__' + rhs[dif.index] + '__+'
        //     )
        // }
      }

      console.log(
        "Type Anomolies detected:\n",
        "\n prior :",
        //JSON.stringify(a),
        "\nlatest :",
        //JSON.stringify(b),
        //"\nDiff\n",

        diffs
      );
    }
    return diffs;
  } else {
    stack[hash] = b;
  }
};

module.exports = callDiff;
