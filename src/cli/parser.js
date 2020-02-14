const glob = require('glob');
const ac = require('async');
const utils = require('./utils');
const fileConcurrency = 10;

const LOCAL_DLOGGER_JS = 'dlogger.js';

function getFunctionName(lineCode) {
  let functionName = '';
  if (/function(\s+)[a-zA-Z]+(\s*)\(.*\)(\s*){/.test(lineCode)) {
    if (lineCode.split('function ').length > 1) {
      functionName = lineCode
        .split('function ')[1]
        .split('(')[0]
        .replace(/(\s*)/g, '');
    }
  } else {
    if (lineCode.split(/\(.*\)/).length > 0) {
      const textInTheLeftOfTheParams = lineCode.split(/\(.*\)/)[0];
      if (/=/.test(textInTheLeftOfTheParams)) {
        if (textInTheLeftOfTheParams.split('=').length > 0) {
          functionName = textInTheLeftOfTheParams
            .split('=')[0]
            .replace(/export |module.exports |const |var |let |=|(\s*)/g, '');
        }
      } else {
        functionName = textInTheLeftOfTheParams.replace(
          /async|public|private|protected|static|export |(\s*)/g,
          ''
        );
      }
    }
  }
  functionName = functionName.split(':')[0];
  const validFunctionNameX = /^[_$a-zA-Z\xA0-\uFFFF][_a-zA-Z0-9\xA0-\uFFFF]*$/;
  if (validFunctionNameX.test(functionName)) {
    const exceptionTrap = /(if|.then)/.test(functionName);
    if (exceptionTrap === false) {
      return functionName;
    }
  } else {
    return;
  }
}

const paramaterise = function(signature) {
  const paramMatch = signature.match(/\((.*?)\)/);

  if (paramMatch) {
    const params = paramMatch[1];

    const paramArr = params.split(/[,]/);
    const res = [];

    for (let param of paramArr) {
      let ptrimmed = param.trim();
      if (ptrimmed.length === 0 || /\W/.test(ptrimmed)) return null;
      res.push(`${ptrimmed} : ${ptrimmed}`);
    }
    return '{' + res.join(', ') + '}';
  } else {
    const param = signature.match(/=\s+(\w*)\s+=>/);
    if (param && param.length >= 1) {
      if (/\W/.test(param[1])) return null;
      return '{' + param[1] + '}';
    } else {
      return null;
    }
  }
};

const addLogging = function(content, config) {
  const buildLogLine = function(match) {
    const functionName = getFunctionName(match);
    if (!functionName) return match;
    const params = paramaterise(match);
    if (!params) return match;
    if (/\w/.test(functionName)) {
      return (
        match + `\n  ${config.nameAs}.log({'${functionName}': ${params}})\n`
      );
    } else {
      return match;
    }
  };
  const functionSignatureX = /(.*function.*\{|.*=>.*\{)/g;
  return content.replace(functionSignatureX, buildLogLine);
};

function clearLogging(content, config) {
  const logSignatureX = new RegExp(`\n.*${config.nameAs}.log.*\n`, 'g');
  const es2015Module = 'import';
  const commonjsModule = 'require';
  const logSignatureImportX = new RegExp(
    `.*(${es2015Module}|${commonjsModule}).*dlogger.*\n`,
    'g'
  );
  return content.replace(logSignatureX, '').replace(logSignatureImportX, '');
}

function prependRequire(content, filePath, config) {
  const splitter = filePath.split('/');
  const pathToDlog =
    './' + '../'.repeat(splitter.length - 2) + LOCAL_DLOGGER_JS;

  if (config.module === 'es2015') {
    return `import ${config.nameAs} from'${pathToDlog}';\n${content}`;
  }
  if (config.module === 'commonjs') {
    return `const ${config.nameAs} = require('${pathToDlog}');\n${content}`;
  }
}

function hasDlogging(files, config) {
  ac.eachLimit(files, fileConcurrency, function(filePath, limitCallBack) {
    utils.readFile(filePath).then(function(res) {
      const checkHasDlogX = new RegExp(`.*${config.nameAs}.*`, 'g'); // /.*dlog.*/g;
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

function parseFiles(files, config, add, clear) {
  ac.eachLimit(files, fileConcurrency, function(filePath, limitCallBack) {
    utils
      .readFile(filePath)
      .then(function(res) {
        let content;
        if (add) {
          content = clearLogging(res.data, config);
          const contentWithLogging = addLogging(content, config);
          if (contentWithLogging !== content)
            content = prependRequire(contentWithLogging, filePath, config);
        } else if (clear) {
          content = clearLogging(res.data, config);
        }
        return utils.writeFile(res.sourcePath, content);
      })
      .then(function() {
        limitCallBack();
      });
  });
  console.log(
    add ? 'Adding' : 'Clearing',
    ` logs done. ${files.length - 1} files updated.`
  );
}

function execute(config, add, clear, checkClean) {
  const { globPattern, excludes } = config;
  console.log(
    'Using configuration: globPattern, ',
    globPattern,
    'excludes:',
    excludes
  );

  const globOptions = {};
  glob(globPattern, globOptions, function(error, files) {
    if (error) {
      console.log(`glob error executing globPattern: ${globPattern} `, error);
    } else {
      // munge- ** to include first dir files.
      const rootGlob = globPattern.replace(/\*\*\//, '');
      glob(rootGlob, globOptions, function(error, rootFiles) {
        if (error) {
          console.log(`glob error executing rootGlob: ${rootGlob} `, error);
        } else {
          const allFiles = [...rootFiles, ...files];
          const excludeX = new RegExp(excludes);
          const reducedFilesList = [];
          for (let file of allFiles) {
            if (!excludeX.test(file)) reducedFilesList.push(file);
          }
          if (add || clear) {
            parseFiles(reducedFilesList, config, add, clear);
          }
          if (checkClean) {
            hasDlogging(reducedFilesList, config);
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
  prependRequire, // exported for testing only. Adds req/impor dlogger to top of file.
  parseFiles // exported for testing only. file reader & writer. calls adds or clearLogging for all files given
};
