const glob = require('glob');
const ac = require('async');
const detectIndent = require('detect-indent');
const utils = require('./utils');
const fileConcurrency = 10;

const LOCAL_DLOGGER_JS = 'dlogger.js';

function getFunctionName(lineCode) {
  let functionName = '';
  //ignore if in single line comment
  if (/^\s*\/\/.*$/.test(lineCode)) return;
  //ignore arrow fn destructure of arguments e.g. => ({})
  if (/=>.+\(\{/.test(lineCode)) return;
  // ignore if arrow assignment fn = arg => res === matcher
  if (/=>.+=.+\{/.test(lineCode)) return;

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
            .replace(
              /export |exports\.|module.exports |const |var |let |=|(\s*)/g,
              ''
            );
        }
      } else {
        functionName = textInTheLeftOfTheParams.replace(
          /async|public|private|protected|static|export |exports\.|(\s*)/g,
          ''
        );
      }
    }
  }

  functionName = functionName.split(':')[0];
  // console.log('________', functionName);
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

const paramaterise = function (signature) {
  const paramMatch = signature.match(/\((.*?)\)/);

  if (paramMatch) {
    let params = paramMatch[1];
    params = params.replace(/[{}]/g, '');

    params.match(/\((.*?)\)/);
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

const getDefaultFunctionName = (functionName, filePath) => {
  if (functionName === 'default' || functionName === 'defaultfunction') {
    const filePathElements = filePath.split('/');
    const fileName = filePathElements[filePathElements.length - 1].split(
      '.'
    )[0];
    if (fileName === 'index') {
      const dirName = filePathElements[filePathElements.length - 2];
      return dirName;
    } else {
      return fileName;
    }
  } else {
    return functionName;
  }
};

const addLogging = function (content, config, filePath) {
  const indentUnit = detectIndent(content).indent || '  ';

  const buildLogLine = function (match) {
    const simpleFunctionName = getFunctionName(match);
    const functionName = getDefaultFunctionName(simpleFunctionName, filePath);

    if (!functionName) return match;
    const params = paramaterise(match);
    if (!params) return match;
    if (/\w/.test(functionName)) {
      let meta = '';
      if (config.argCheck) {
        meta = ', { arguments }';
      }

      const functionIndentMatch = match.match(/^(\s+)\w/);
      const functionIndent = (functionIndentMatch && functionIndentMatch[1]) ? functionIndentMatch[1] : ''
      const indentWith = indentUnit + functionIndent;
      return (
        match +
        `\n${indentWith}${config.nameAs}.log( { '${functionName}' : ${params} }${meta} )\n`
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

  const incluseExp =
    config.module === 'commonjs'
      ? `.*${config.nameAs}.*require.*\n`
      : `.*import.*${config.nameAs}.*\n`;
  const logSignatureImportX = new RegExp(incluseExp, 'g');
  return content.replace(logSignatureX, '').replace(logSignatureImportX, '');
}

function prependRequire(content, filePath, config) {
  if (config.dloggerPackage !== undefined) {
    if (config.module === 'es2015') {
      return `import ${config.nameAs} from '${config.dloggerPackage}';\n${content}`;
    }
    if (config.module === 'commonjs') {
      return `const ${config.nameAs} = require ('${config.dloggerPackage}');\n${content}`;
    }
  } else {
    const splitter = filePath.split('/');
    const pathToDlog =
      './' + '../'.repeat(splitter.length - 2) + LOCAL_DLOGGER_JS;
    if (config.module === 'es2015') {
      return `import ${config.nameAs} from '${pathToDlog}';\n${content}`;
    }
    if (config.module === 'commonjs') {
      return `const ${config.nameAs} = require ('${pathToDlog}');\n${content}`;
    }
  }
}

function hasDlogging(files, config) {
  ac.eachLimit(files, fileConcurrency, function (filePath, limitCallBack) {
    utils.readFile(filePath).then(function (res) {
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
  ac.eachLimit(files, fileConcurrency, function (filePath, limitCallBack) {
    utils
      .readFile(filePath)
      .then(function (res) {
        let content;
        if (add) {
          content = clearLogging(res.data, config);
          const contentWithLogging = addLogging(content, config, filePath);
          if (contentWithLogging !== content)
            content = prependRequire(contentWithLogging, filePath, config);
        } else if (clear) {
          content = clearLogging(res.data, config);
        }
        return utils.writeFile(res.sourcePath, content);
      })
      .then(function () {
        limitCallBack();
      });
  });
  console.log(
    add ? 'Adding' : 'Clearing',
    ` logs done. ${files.length} files checked.`
  );
}

function buildFileList(globPattern, excludes, cb) {
  const globOptions = {};
  glob(globPattern, globOptions, function (error, files) {
    if (error) {
      console.log(`glob error executing globPattern: ${globPattern} `, error);
      cb(null);
    } else {
      const rootGlob = globPattern.replace(/\*\*\//, '');
      glob(rootGlob, globOptions, function (error, rootFiles) {
        if (error) {
          console.log(`glob error executing rootGlob: ${rootGlob} `, error);
          cb(null);
        } else {
          const allFiles = [...rootFiles, ...files];
          const excludeX = new RegExp(excludes);
          const reducedFilesList = [];
          for (let file of allFiles) {
            if (!excludeX.test(file)) reducedFilesList.push(file);
          }
          const deDuped = [...new Set(reducedFilesList)];
          cb(deDuped);
        }
      });
    }
  });
}

function execute(config, add, clear, checkClean) {
  const { globPattern, excludes } = config;
  console.log('\nUsing configuration: globPattern, ', config);

  if (globPattern.match(/\.\.\//)) {
    throw new Error(
      `config.globPattern may not include '../'. 
      \nIt must only affect subdirectories of current working dir.
      \nThis is for your own safety!`
    );
  }
  buildFileList(globPattern, excludes, fileList => {
    if (add || clear) {
      parseFiles(fileList, config, add, clear);
    }
    if (checkClean) {
      hasDlogging(fileList, config);
    }
  });
}

module.exports = {
  execute, // single usage entry point fn.
  getFunctionName, // exported for testing only. extracts function name.
  getDefaultFunctionName, // special case name function after file / parent dir if index.
  hasDlogging, // exported for testing only. checks if dlog in codebase. (CI no no -exit(1))
  clearLogging, // exported for testing only. Removes logging from given content string
  addLogging, //exported for testing only. Adds logging to given content string,
  prependRequire, // exported for testing only. Adds req/impor dlogger to top of file.
  paramaterise, // extract named params.
  parseFiles // exported for testing only. file reader & writer. calls adds or clearLogging for all files given
};
