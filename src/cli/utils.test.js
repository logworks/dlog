'use strict';
jest.mock('fs');
const utils = require('./utils');

describe('util promisified fs.readFile and fs.writeFile', () => {
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

describe('simplisticRelativePathResolve', () => {
  it('A. same dir : /src', () => {
    const filePathOrigin = 'src/source.js';
    const filePathTarget = 'src/target.js';
    const recieved = utils.simplisticRelativePathResolve(
      filePathOrigin,
      filePathTarget
    );
    expect(recieved).toBe('./target.js');
  });

  it('B. src/sub/sub/origin to /.target', () => {
    const filePathOrigin = 'src/sub/sub/origin.js';
    const filePathTarget = 'target.js';
    const recieved = utils.simplisticRelativePathResolve(
      filePathOrigin,
      filePathTarget
    );
    expect(recieved).toBe('./../../../target.js');
  });

  it('C. src/sub/sub/origin to src/target', () => {
    const filePathOrigin = 'src/sub/sub/origin.js';
    const filePathTarget = 'src/target.js';
    const recieved = utils.simplisticRelativePathResolve(
      filePathOrigin,
      filePathTarget
    );
    expect(recieved).toBe('./../../target.js');
  });

  it('D. src/sub/sub/origin to src/tsub/target', () => {
    const filePathOrigin = 'src/sub/sub/origin.js';
    const filePathTarget = 'src/tsub/target.js';

    const recieved = utils.simplisticRelativePathResolve(
      filePathOrigin,
      filePathTarget
    );
    expect(recieved).toBe('./../../tsub/target.js');
  });

  it('E. only one path starts with ./', () => {
    const filePathOrigin = 'src/source.js';
    const filePathTarget = './src/target.js';
    const recieved = utils.simplisticRelativePathResolve(
      filePathOrigin,
      filePathTarget
    );
    expect(recieved).toBe('./target.js');
  });
});
