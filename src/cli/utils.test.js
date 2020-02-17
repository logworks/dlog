'use strict';
jest.mock('fs');
const utils = require('./utils');

describe('util promisified  fs.readFile and fs.writeFile', () => {
  it(' readFile should return a promise, which resolves for validFile', done => {
    utils.readFile('validFile').then(({ path, data }) => {
      expect(data).toBe('data');
      done();
    });
  });

  it(' readFile should return a promise, which rejects for an invalidFile', done => {
    utils.readFile('inValidFile').catch(error => {
      expect(error).toBeTruthy();
      done();
    });
  });

  it(' writeFile should return a promise, which resolves for writing to validFile', done => {
    utils.writeFile('validFile', 'data').then(({ savePath, data }) => {
      expect(data).toBe('data');
      done();
    });
  });

  it(' writeFile should return a promise, which Rejects for writing to invalidFile', done => {
    utils.writeFile('INvalidFile', 'data').catch(error => {
      expect(error).toBeTruthy();
      done();
    });
  });
});
