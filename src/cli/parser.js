const fs = require("fs");
const glob = require("glob");
const ac = require("async");
const utils = require("./utils");
const fileConcurrency = 10; //limited so as not to overload disk i/0 r/w ops /cpu. todo: make configurable.

const LOCAL_DLOGGER_JS = "dlogger.js";
/*
given linCode: String (prior identifed as a function), extract the fuction name.
*/
function getFunctionName(lineCode) {
  let functionName = "";
  if (/function(\s+)[a-zA-Z]+(\s*)\(.*\)(\s*){/.test(lineCode)) {
    if (lineCode.split("function ").length > 1) {
      functionName = lineCode
        .split("function ")[1]
        .split("(")[0]
        .replace(/(\s*)/g, "");
    }
  } else {
    if (lineCode.split(/\(.*\)/).length > 0) {
      const textInTheLeftOfTheParams = lineCode.split(/\(.*\)/)[0];
      if (/=/.test(textInTheLeftOfTheParams)) {
        if (textInTheLeftOfTheParams.split("=").length > 0) {
          functionName = textInTheLeftOfTheParams
            .split("=")[0]
            .replace(/export |module.exports |const |var |let |=|(\s*)/g, "");
        }
      } else {
        functionName = textInTheLeftOfTheParams.replace(
          /async|public|private|protected|static|export |(\s*)/g,
          ""
        );
      }
    }
  }
  functionName = functionName.split(":")[0];
  const validFunctionName = /^[_$a-zA-Z\xA0-\uFFFF][_a-zA-Z0-9\xA0-\uFFFF]*$/;
  if (validFunctionName.test(functionName) && functionName !== "if") {
    return functionName;
  } else {
    return "";
  }
}
/*
    given a function signature, extract the (parameters, ...)
*/
const paramaterise = function(signature) {
  const params = signature.match(/\((.*?)\)/)[1];
  const paramArr = params.split(/[,]/);
  const res = [];

  for (param of paramArr) {
    let ptrimmed = param.trim();
    if (ptrimmed !== "") res.push(`${ptrimmed} : ${ptrimmed}`);
  }
  return "{" + res.join(", ") + "}";
};

const addLogging = function(content, filePath) {
  const buildLogLine = function(match) {
    const params = paramaterise(match);
    const functionName = getFunctionName(match);
    if (/\w/.test(functionName)) {
      return (
        match + `\n  dlog.log({'${functionName}': ${params}})\n`
        //explict verbose:  `\n  dlog.log({name: '${functionName}', params: ${params}})\n`
      );
    } else {
      return match;
    }
  };
  const functionSignatureX = /(.*function.*\{|.*=>.*\{)/g;
  return content.replace(functionSignatureX, buildLogLine);
};
/*
    remove all dlog code from source:logging and require's
*/
function clearLogging(content) {
  const logSignatureX = /\n.*dlog.*\n/g; //deletes line
  const logSignatureImportX = /.*dlog.*\n/g; //first line in file.
  return content.replace(logSignatureX, "").replace(logSignatureImportX, "");
}

/*
    insert require dlog at start of source files on dlog --add
*/
function prependRequire(content, filePath) {
  const splitter = filePath.split("/");
  // -2 why?- note globbing result always starts ./ and /sourcefile.js at end.
  const pathToDlog =
    "./" + "../".repeat(splitter.length - 2) + LOCAL_DLOGGER_JS;
  return `const dlog = require('${pathToDlog}');\n${content}`;
}

/*
    dlog --test : check if 'dlog' anywhere in configured codebase to affect.
    if so, fails with process.exit(1). Primary use: pre-commit/push hooks & CI:
    reason: development logging should never be commited, let alone allowed into production - yikes!
*/
function hasDlogging(files) {
  ac.eachLimit(files, fileConcurrency, function(filePath, limitCallBack) {
    utils.readFile(filePath).then(function(res) {
      const checkHasDlogX = /.*dlog.*/g;
      if (checkHasDlogX.test(res.data)) {
        console.log(
          `dlog found in code.
                    <Expected capture Error for CI/pre commit/push hooking.>
                     First detection exits. First file with dlog detected: ${filePath}`
        );
        process.exit(1);
      }
      limitCallBack();
    });
  });
}
/*
    read, transform, write for dlog --add and dlog --remove.
*/
function parseFiles(files, add, clear) {
  ac.eachLimit(files, fileConcurrency, function(filePath, limitCallBack) {
    utils
      .readFile(filePath)
      .then(function(res) {
        let content;
        if (add) {
          content = clearLogging(res.data);
          content = addLogging(content);
          content = prependRequire(content, filePath);
        } else if (clear) {
          content = clearLogging(res.data, filePath);
        }
        return utils.writeFile(res.sourcePath, content);
      })
      .then(function() {
        limitCallBack();
      });
  });
  console.log(
    add ? "Adding" : "Clearing",
    ` logs done. ${files.length - 1} files updated.`
  );
}

/*
    public entry-point to parser. 
*/
// example:
// globPattern = "./testdir/**/*.js"
// add / clear / checkClean all bool - choose only one.
// refactor - command pattern?
/*
 wy wierd comments - cant show glob *double* in /* multi-line comments!
*/
function execute(config, add, clear, checkClean) {
  const { globPattern, excludes } = config;
  console.log(
    "Using configuration: globPattern, ",
    globPattern,
    "excludes:",
    excludes
  );
  const globOptions = {}; //{ ignore: excludes }
  glob(globPattern, globOptions, function(error, files) {
    if (error) {
      console.log(`glob error executing globPattern: ${globPattern} `, error);
    } else {
      //munge ** to include ** dir files.
      const rootGlob = globPattern.replace(/\*\*\//, "");
      glob(rootGlob, globOptions, function(error, rootFiles) {
        if (error) {
          console.log(`glob error executing rootGlob: ${rootGlob} `, error);
        } else {
          const allFiles = [...rootFiles, ...files];
          //apply exclusion:
          const excludeX = new RegExp(excludes);
          const reducedFilesList = [];
          for (file of allFiles) {
            if (!excludeX.test(file)) reducedFilesList.push(file);
          }

          if (add || clear) {
            parseFiles(reducedFilesList, add, clear);
          }
          if (checkClean) {
            hasDlogging(reducedFilesList);
          }
        }
      });
    }
  });
}

module.exports = {
  execute, // single usage entry point fn.
  getFunctionName, // exported for testing only. extracts function name.
  hasDlogging, // exported for testing only. checks if dlog in codebase. (CI no no -exit(1))
  clearLogging, // exported for testing only. Removes logging from given content string
  addLogging, //exported for testing only. Adds logging to given content string,
  prependRequire, // exported for testing only. Adds require dlogger to top of file.
  parseFiles // exported for testing only. file reader & writer. calls adds or clearLogging for all files given
};
