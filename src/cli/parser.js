const glob = require('glob');
const ac = require('async');
const detectIndent = require('detect-indent');
const utils = require('./utils');
const fileConcurrency = 5;


/*
  maybeAFunction, guards against false positive function identification.
*/
function maybeAFunction(lineCode) {
  const possibleFunction = /function|=>/;
  if (!possibleFunction.test(lineCode)) return false
  const notAFunctionTests = [
    /^\s*\/\/.*$/,      // singleLineComment i.e.  // function...
    /=>.+\(\{/,         // implicitReturn i.e.  arrow fn destructure of arguments e.g. => ({})
    /=>.+=.+\{/,        // arrowFunctionAssignment i.e.  fn = arg => res === matcher
    /(if|.then)/        // logicFork logic fork - too complex, if code style does this with named function, we wont log it.
  ]

  // inefficient but readable 
  let result = true
  notAFunctionTests.forEach(expression => {
    const isNotAFuction = expression.test(lineCode)
    if (isNotAFuction === true) result = false
  })
  return result
}

/*
@param lineCode - single line of code

*/

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
  const validFunctionNameX = /^[_$a-zA-Z\xA0-\uFFFF][_a-zA-Z0-9\xA0-\uFFFF]*$/;
  if (functionName !== 'default' && functionName !== 'defaultfunction' && validFunctionNameX.test(functionName)) {
    return functionName;
  } else {
    return null
  }
}

const paramaterise = function (signature) {
  //replace ... to handle spread ...args
  const paramMatch = signature.replace('...', '').match(/\((.*?)\)/);
  const noParams = '{}'
  if (paramMatch) {
    let params = paramMatch[1];
    params = params.replace(/[{}]/g, '');

    params.match(/\((.*?)\)/);
    const paramArr = params.split(/[,]/);
    const res = [];

    for (let param of paramArr) {
      let ptrimmed = param.trim();
      if (ptrimmed.length === 0 || /\W/.test(ptrimmed)) return noParams;
      res.push(`${ptrimmed} : ${ptrimmed}`);
    }
    return '{' + res.join(', ') + '}';
  } else {
    const param = signature.match(/=\s+(\w*)\s+=>/);
    if (param && param.length >= 1) {
      if (/\W/.test(param[1])) return noParams;
      return '{' + param[1] + '}';
    } else {
      return noParams;
    }
  }
};
/*
  special case for export default / module.export =
  returns the name of the module(file), or if file is named index,
  the parent folders name.
*/
const getDefaultFunctionName = (match, filePath) => {
  console.log('getDefaultFunctionName', match, filePath)
  if (
    /module.exports =|export default/.test(match)
  ) {
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
    return null
  }
}

const addLogging = function (content, config, filePath) {
  const indentUnit = detectIndent(content).indent || '  ';

  const buildLogLine = function (match) {
    const metaParams = []
    if (!maybeAFunction(match)) return match
    let functionName = getFunctionName(match);
    if (!functionName) {
      functionName = getDefaultFunctionName(match, filePath);
      metaParams.push(`defaultExport : '${functionName}'`)

    }

    if (!functionName) return match;
    const params = paramaterise(match);
    console.log('addLogging-functionName', functionName, params)
    // if (!params) return match;
    if (/\w/.test(functionName)) {
      metaParams.push('arguments')

      const functionIndentMatch = match.match(/^(\s+)\w/);
      const functionIndent =
        functionIndentMatch && functionIndentMatch[1]
          ? functionIndentMatch[1]
          : '';
      const indentWith = indentUnit + functionIndent;

      return (
        match +
        `\n${indentWith}${config.nameAs}.log( { '${functionName}' : ${params} }, { ${metaParams.join(', ')} } )\n`
      );
    } else {
      return match;
    }
  };
  const functionSignatureX = /(.*function.*\)\s+\{|.*=>\s+\{)/g // /(.*function.*\{|.*=>.*\{)/g;
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
  const pathToDlog = utils.simplisticRelativePathResolve(
    filePath,
    config.localDlogPath
  );
  if (config.module === 'es2015') {
    return `import ${config.nameAs} from '${pathToDlog}';\n${content}`;
  }
  if (config.module === 'commonjs') {
    return `const ${config.nameAs} = require ('${pathToDlog}');\n${content}`;
  }
}

async function hasDlogging(files, config) {
  await ac.eachLimit(files, fileConcurrency, function (filePath, limitCallBack) {
    utils.readFile(filePath).then(function (res) {
      const checkHasDlogX = new RegExp(`.*${config.nameAs}.*`, 'g'); // /.*dlog.*/g;
      if (checkHasDlogX.test(res.data)) {
        process.stdout.write(
          `dlog found in code:  ${filePath}.  First detection exits code(1)\n\n`
        );
        process.exit(1);
      }
      limitCallBack();
    });
  });
  console.log('Code clean of dlog checked with current config.\n');
}

async function parseFiles(files, config, add, clear) {
  let addedFileCount = 0;
  await ac.eachLimit(files, fileConcurrency, function (filePath, limitCallBack) {
    utils
      .readFile(filePath)
      .then(function (res) {
        let content;
        if (add) {
          content = clearLogging(res.data, config);
          const contentWithLogging = addLogging(content, config, filePath);
          if (contentWithLogging !== content) {
            content = prependRequire(contentWithLogging, filePath, config);
            addedFileCount += 1;
            process.stdout.write('\n' + filePath)
          }
        } else if (clear) {
          content = clearLogging(res.data, config);
        }
        return utils.writeFile(res.sourcePath, content);
      })
      .then(function () {
        limitCallBack();
      });
  });
  if (add) {
    console.log(
      `dlog: adding logging: ${files.length} files inspected, ${addedFileCount} updated.`
    );
  }
  if (clear) {
    console.log(`dlog: clearing logging completed.`);
  }
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
  // console.log('\nUsing configuration: globPattern, ', config);

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
  maybeAFunction, // guards against false positive function ident.
  hasDlogging, // exported for testing only. checks if dlog in codebase. (CI no no -exit(1))
  clearLogging, // exported for testing only. Removes logging from given content string
  addLogging, //exported for testing only. Adds logging to given content string,
  prependRequire, // exported for testing only. Adds require/import dlog to top of file.
  paramaterise, // extract named params.
  parseFiles // exported for testing only. file reader & writer. calls adds or clearLogging for all files given
};
