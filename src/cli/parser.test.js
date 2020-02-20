const parser = require('./parser');

const namedFunctions = [
  'function functionName(){',
  'function functionName (arg1, arg2) {',
  'functionName (arg1, arg2, arg3) {',
  'functionName = function (arg1, arg2) {',
  'functionName = (arg1, arg2) => {',
  'functionName = function otherName (arg1, arg2) => {',
  'array.forEach(function functionName() {',
  'export const functionName = (arg1, arg2) => {',
  'functionName(arg1: any): any {',
  'async functionName(arg1: any): any {',
  'public functionName(arg1: any): any {',
  'public async functionName(arg1: any): any {',
  'public static functionName(arg1: any): any {',
  'private functionName(arg1: any): any {',
  'protected functionName(arg1: any): any {',
  'static functionName(arg1: any): any {',
  'export functionName(arg1: any): any {',
  'functionName({arg1, arg2}) {',
  'functionName({arg1, arg2}) { // inline comment after function',
  'exports.functionName = function(arg1, arg2) {'
];

const namedFunctionExceptions = [
  'if (typeof require === "function") {',
  '// function fname (p1) {',
  'const mapStateToProps = (state) => ({',
  'const mapStateToProps = (state): * => ({',
  'render={({ isLoading }) => primaryAction({',
  'setActiveChannel = e => this.setState({',
  "const isSerializedJSON = str => str[0] === '{'"
];

describe('getFunctionName extracts function name from valid function signatures.', () => {
  it(`Gets function name from a line of code representing a function declaration'`, function() {
    namedFunctions.forEach(namedFunction => {
      const res = parser.getFunctionName(namedFunction);
      // console.log('test input ', namedFunction, 'res: ', res);
      expect(res).toBe('functionName');
    });
  });

  it(`Does not get function name from a line of code easily mistaken for a false positive function declaration'`, function() {
    namedFunctionExceptions.forEach(namedFunction => {
      expect(parser.getFunctionName(namedFunction)).toBe(undefined);
    });
  });
  /*
 export default function declared inline un-named special case.
 the functionName is effectivly the filename.
 further, if the file is named index, its the parent dir name!
 e.g. 'export default (arg1) => {'
 getFunctionName returns 'default' in this case, and it is 
 up to the caller to apply file name / parent dir.
 see: defaultFunctionName
*/
  it(`returns default for default export unnamed functions`, function() {
    const namedFunction = 'export default (arg1) => {';
    expect(parser.getFunctionName(namedFunction)).toBe('default');
  });

  it(`getDefaultFunctionName returns functionName as name of file`, function() {
    const namedFunction = 'default';
    const filePath = 'src/component/TestComponent.js';
    expect(parser.getDefaultFunctionName(namedFunction, filePath)).toBe(
      'TestComponent'
    );
  });

  it(`getDefaultFunctionName returns parent dir name if file named index`, function() {
    const namedFunction = 'default';
    const filePath = 'src/component/TestComponent/index.js';
    expect(parser.getDefaultFunctionName(namedFunction, filePath)).toBe(
      'TestComponent'
    );
  });
});

describe('paramaterise(string) extract named paramaters.', () => {
  it('extracts unbracketed single paramater for arrow function', () => {
    const input = 'fname = p1 => {';
    const output = parser.paramaterise(input);
    expect(output).toBe('{p1}');
  });
  it('extracts deconstructed object paramaters', () => {
    const input = 'function fname ({p1, p2}) {';
    const output = parser.paramaterise(input);
    expect(output).toBe('{p1 : p1, p2 : p2}');
  });
});

describe('execute ', () => {
  it('throws error if ../ is in the globPattern parameter', done => {
    const config = { globPattern: '../**/zzxxyy' };
    try {
      parser.execute(config);
    } catch (error) {
      expect(error).toBeTruthy();
      done();
    }
  });
});

describe('parser.prependRequire', () => {
  it(' If config.dloggerPackage:Unspecified returns paths to filePath/dlogger.js', () => {
    const content = '';
    config = {
      module: 'commonjs',
      nameAs: 'dlog'
    };
    const res = parser.prependRequire(
      content,
      './test/testsub.file.js',
      config
    );
    expect(res).toBe(`const dlog = require ('./../dlogger.js');\n`);
  });

  it(' If config.dloggerPackage Unspecified, returns paths to filePath/dlogger.js. With import if config.module=es2015', () => {
    const content = '';
    config = {
      module: 'es2015',
      nameAs: 'dlog'
    };
    const res = parser.prependRequire(
      content,
      './test/testsub/file.js',
      config
    );
    expect(res).toBe(`import dlog from './../../dlogger.js';\n`);
  });

  it('if config.dloggerPackage:Specified, it is inclused. With require if config.module=commonjs', () => {
    const content = '';
    config = {
      dloggerPackage: 'acme-dlogger-node',
      module: 'commonjs',
      nameAs: 'dlog'
    };
    const res = parser.prependRequire(content, null, config);

    expect(res).toEqual(`const dlog = require ('acme-dlogger-node');\n`);
  });

  it('if config.dloggerPackage:Specified, it is inclused. With import if config.module=es2015', () => {
    const content = '';
    config = {
      dloggerPackage: 'acme-dlogger-node',
      module: 'es2015',
      nameAs: 'dlogger'
    };
    const res = parser.prependRequire(content, null, config);

    expect(res).toEqual(`import dlogger from 'acme-dlogger-node';\n`);
  });
});
