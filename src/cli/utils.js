'use strict';
/*
    Reusable stuff bucket that doesnt fit niceley anywhere else ;-\

    - Promisified readFile and writeFile: for friendlier async use.

*/
const fs = require('fs');

function readFile(sourcePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(sourcePath, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve({ sourcePath, data });
      }
    });
  });
}

function writeFile(savePath, data) {
  return new Promise(function(resolve, reject) {
    // data, { encoding: 'utf-8', flag: 'w' }
    fs.writeFile(savePath, data, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ savePath, data });
      }
    });
  });
}

/*
  simplisticRelativePathResolve
  as function name implies, overly simplistic,
  just dont want depedency with sub dependencies for now: 
  @see https://github.com/webpack/enhanced-resolve - as used by webpack.
  Scenario:
  Given operating from project root 
  and filePathTarget, filePathOrigin also relative to project root,
  resolve a path from filePathOrigin to filePathTarget
  so that can do
  in filePathTarget: 
  require('resolvedPathToTargetFromOrigin')
*/
function simplisticRelativePathResolve(filePathOrigin, filePathTarget) {
  // if either start with ./, remove.

  if (filePathOrigin.slice(0, 2) === './') {
    filePathOrigin = filePathOrigin.slice(2, filePathOrigin.length);
  }
  if (filePathTarget.slice(0, 2) === './') {
    filePathTarget = filePathTarget.slice(2, filePathTarget.length);
  }
  console.log('_', filePathOrigin, '__', filePathTarget);

  const targetSplit = filePathTarget.split('/');
  const targetFile = targetSplit[targetSplit.length - 1];
  const targetPath = targetSplit.slice(0, targetSplit.length - 1);
  const originSplit = filePathOrigin.split('/');
  const originPath = originSplit.slice(0, originSplit.length - 1);

  // ascend from origin to shared root with target:
  let originAscendantPathCount = 0;

  for (let i = 0; i < originPath.length; i++) {
    if (targetPath[i] === undefined || originPath[i] !== targetPath[i]) {
      originAscendantPathCount += 1;
    }
  }
  // ascertain shared root length. (assuming top same)
  let sharedRootPathCount = 0;
  for (let i = 0; i < originPath.length; i++) {
    if (originPath[i] === targetPath[i]) {
      sharedRootPathCount++;
    }
  }
  //descend from after shared root to target:
  let targetFilePath = '';
  for (let i = targetPath.length - 1; i > sharedRootPathCount - 1; i--) {
    if (targetPath[i] !== undefined) {
      targetFilePath += targetPath[i] + '/';
    }
  }
  return (
    './' + '../'.repeat(originAscendantPathCount) + targetFilePath + targetFile
  );
}
module.exports = { readFile, writeFile, simplisticRelativePathResolve };
