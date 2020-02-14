/*
    Reusable stuff bucket that doesnt fit niceley anywhere else ;-\

    - Promisified readFile and writeFile: for friendlier async use.

*/
const fs = require('fs');

function readFile(sourcePath) {
  console.log('_______', fs.readFile);
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

module.exports = { readFile, writeFile };
