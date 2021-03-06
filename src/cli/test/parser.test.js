const parser = require('../parser');

const namedFunctions = [
  ' functionName (p1) {',  //class member function
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
  'exports.functionName = function(arg1, arg2) {',
  'export const functionName = (communityIds: Array<string>): Promise<?DBCommunitySettings> => {'
  // unparsable (without proper squash & parse lexer approach - beyond regx)
  // prettier-ignore
  //'export const isAuthedResolver = (resolver: Function) => async (obj: any, args: any, context: GraphQLContext, info: any) => {'
  // to simplified: fn => fn => same line:
  //'export const isAuthedResolver = (resolver: Function) => (obj) => {'
  // 'export const functionName = (resolver: Function) => ' -works, stylistic parsable code issue?
  //  Todo: multi-line function signatures:
  //   export default (
  //   { id }: DBThread,
  //   {
  //     first,
  //     after,
  //     last,
  //     before,
  //   }: { ...PaginationOptions, last: number, before: string },
  //   { user }: GraphQLContext
  // ) => {
];



describe('getFunctionName extracts function name from valid function signatures.', () => {
  it.only(`Gets function name from a line of code representing a function declaration'`, function () {
    namedFunctions.forEach(namedFunction => {
      // console.log('namedFunction', namedFunction)
      const res = parser.getFunctionName(namedFunction);
      expect(res).toBe('functionName');
    });
  });

  it(`identifyFunction returns true for line of code representing a function declaration`, function () {
    namedFunctions.forEach(namedFunction => {
      // console.log('namedFunction', namedFunction)
      const res = parser.identifyFunction(namedFunction);
      expect(res).toBe(true);
    });
  });

  it(`identifyFunction returns false for code easily mistaken as false positive function declaration`, function () {
    const invalidNamedFunctions = [
      'if (typeof require === "function") {',
      '// function fname (p1) {',
      'const mapStateToProps = (state) => ({',
      'const mapStateToProps = (state): * => ({',
      'render={({ isLoading }) => primaryAction({',
      'setActiveChannel = e => this.setState({',
      "const isSerializedJSON = str => str[0] === '{'"
    ];

    invalidNamedFunctions.forEach(signature => {
      expect(parser.identifyFunction(signature)).toBe(false);
    });
  });
  /*
    un-named special case for 'export default' and 'module.exports ='.
    the functionName is effectivly the filename.
    further, if the file is named index, its the parent dir name!
    e.g. 'export default (arg1) => {'
    getFunctionName returns 'default' in this case, and it is 
    up to the caller to apply file name / parent dir.
    see: defaultFunctionName
*/


  //export default cases: TODO -refactor, should all return undefined.

  it(`returns null for default export unnamed arrow functions`, function () {
    const namedFunction = 'export default (arg1) => {';
    expect(parser.getFunctionName(namedFunction)).toBe(null);
  });

  it(`returns defaultfunction for default export unnamed functions`, function () {
    const namedFunction = 'export default function (arg1) {';
    expect(parser.getFunctionName(namedFunction)).toBe(null);
  });

  it(`returns defaultfunction for default export unnamed functions, with no params`, function () {
    const namedFunction = 'export default function () {';
    expect(parser.getFunctionName(namedFunction)).toBe(null);
  });

  it(`returns defaultfunction for default export unnamed async functions`, function () {
    const namedFunction = 'export default async function (arg1) {';
    expect(parser.getFunctionName(namedFunction)).toBe(null);
  });

  it(`returns default for default export unnamed async arrow functions`, function () {
    const namedFunction = 'export default async  (arg1) => {';
    expect(parser.getFunctionName(namedFunction)).toBe(null);
  });

  it(`returns default for default export unnamed arrow functions, with no params`, function () {
    const namedFunction = 'export default () => {';
    expect(parser.getFunctionName(namedFunction)).toBe(null);
  });



  //defaultFunctionName 

  it(`getDefaultFunctionName for arrowFunction returns functionName as name of file`, function () {
    const namedFunction = 'default';
    const filePath = 'src/component/TestComponent.js';
    const match = 'module.exports = () => {}'
    expect(parser.getDefaultFunctionName(match, filePath)).toBe(
      'TestComponent'
    );
  });

  it(`getDefaultFunctionName  for function() returns functionName as name of file`, function () {
    const namedFunction = 'default';
    const filePath = 'src/component/TestComponent.js';
    const match = 'module.exports = function (p1) {}'
    expect(parser.getDefaultFunctionName(match, filePath)).toBe(
      'TestComponent'
    );
  });

  it(`getDefaultFunctionName returns parent dir name if file named index`, function () {
    const namedFunction = 'default';
    const filePath = 'src/component/TestComponent/index.js';
    const match = 'export default () => {}'
    expect(parser.getDefaultFunctionName(match, filePath)).toBe(
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

  it('extracts spread ...args', () => {
    const input = 'function fname (...args) {';
    const output = parser.paramaterise(input);
    expect(output).toBe('{args : args}');
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

describe('addLogging (content, config, filePath)', () => {
  it('injects auto logging into an export default unnamed arrow function', () => {
    const content = `export default () => { return }`;
    const config = {
      globPattern: './**/*.?(js|jsx|ts|tsx)',
      excludes: 'node_modules|\\.test|dlog.js',
      module: 'commonjs',
      nameAs: 'autodlog',
      argCheck: true
    };
    const filePath = 'src/testing/defaultTester.js';
    const res = parser.addLogging(content, config, filePath);
    expect(res).toMatch(/autodlog.log/);
  });
});


describe('addLogging (content, config, filePath)', () => {

  it('injects auto logging into an export default unnamed arrow function', () => {
    const content =
      `export default () => { }`
    const config = {
      "globPattern": "./**/*.?(js|jsx|ts|tsx)",
      "excludes": "node_modules|\\.test|dlog.js",
      "module": "commonjs",
      "nameAs": "autodlog",
      "argCheck": true
    }
    const filePath = 'src/testing/defaultTester.js'
    const res = parser.addLogging(content, config, filePath)
    expect(res).toMatch(/autodlog.log/);
  })

  //edge case dlog + on async library
  it('inserts log at the very first opening curly bracket of function body', () => {
    const content = 'function functionName(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'
    const res = parser.addLogging(content, { "nameAs": "autodlog" }, 'any/path/file.js')
    expect(res).toEqual(
      'function functionName(obj) {' + '\n' +
      "  autodlog.log( { 'functionName' : {obj : obj} }, { arguments } )" + '\n' +
      ' return obj && obj.__esModule ? obj : { default: obj }; }')
  })
})
