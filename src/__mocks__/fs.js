'use strict';
const readFile = (path, format, cb) => {
  if (path === 'validFile') {
    cb(null, 'data');
  } else {
    cb(new Error('Invalid file'), null);
  }
};

const writeFile = (savePath, data, cb) => {
  if (savePath === 'validFile') {
    cb(null, { savePath, data });
  } else {
    cb(new Error('Invalid'), null);
  }
};

exports.readFile = readFile;
exports.writeFile = writeFile;
