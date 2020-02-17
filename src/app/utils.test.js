const utils = require('./utils');

describe('util function isObject', () => {
  it('when given an Array returns false', () => {
    const input = [1, 2, 3];
    const output = utils.isObject(input);
    expect(output).toBe(false);
  });
  it('when given an Object {} returns false', () => {
    const input = {};
    const output = utils.isObject(input);
    expect(output).toBe(true);
  });
});

describe('util function hasKeys', () => {
  it('hasKeys returns true if number of keys at first level of object is one', () => {
    const input = { oneKey: '' };
    const output = utils.hasKeys(input);
    expect(output).toBe(true);
  });

  it('hasKeys returns false if number of keys at first level of object is none', () => {
    const input = {};
    const output = utils.hasKeys(input);
    expect(output).toBe(false);
  });

  it('hasKeys returns true if number of keys at first level of object is more than one', () => {
    const input = { firstKey: '', secondKey: {} };
    const output = utils.hasKeys(input);
    expect(output).toBe(true);
  });

  it('hasKeys returns false if object is an array.', () => {
    const input = [1];
    const output = utils.hasKeys(input);
    expect(output).toBe(false);
  });

  it('give an primative param, hasKeys returns false .', () => {
    const input = 'a string';
    const output = utils.hasKeys(input);
    expect(output).toBe(false);
  });
});
