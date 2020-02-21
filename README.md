# @genisense/dlog

[![Build Status](https://travis-ci.com/logworks/dlog.svg?branch=master)](https://travis-ci.com/logworks/dlog)
[![Coverage Status](https://coveralls.io/repos/github/logworks/dlog/badge.svg?branch=master)](https://coveralls.io/github/logworks/dlog?branch=master)

Logging focused at development time.
Aim :- 100% unobtrusive, zero coding, exploratory logging/debugging.

Pre-release. [v 0.3.3](#v0.3.3) early POC so API is likeley to change.

Install

    npm i -D @genisense/dlog   #or#   yarn add -D @genisense/dlog
    npm i -g @genisense/dlog 
    dlog i # initialise

Cli commands:

    $ dlog +        # auto-logs every named function.
    $ dlog -        # removes all logs added by dlog +.
    $ dlog ?        # halts CI if dlog present in code pre-push.

Run application (node or browser), at console:

    d.log( { label: { param1, param2 } } )
    d.r() // report metrics, anomolies, suggests.
    d.c() // get and set log configuration.

TODO: EXAMPLE SCREEN VID.



## quick start

once installed - see top, '$ dlog i' creates two files:

    ./.dlogrc  // $ dlog  (cli configuration)
    ./dlog.js  // runtime configuration, customisation point.

Edit .dlogrc. Set the globPattern and excludes to match your project. (globPattern matches the files/directories given, and exclude sets files you dont want logging added to.)

You are now ready to Log & Roll:

    # Add logging to all files specified in config:
    $ dlog +

    # Remove logging from all files (again specified in config:
    $ dlog -

You can also filter on the fly without reloading, for example if running a browser app, at the console:

    # with globalLogger, can use it to change config from console
    d.config.typeCheck = true

    # To only log functions named foo or bar
    d.config.include = ['foo','bar']

    # Log every function (that was added according to globPattern config)
    d.config.include = ['*']

    #exclude specific functioins - useful for chatty ones:
    d.config.exclude = ['onMouseMove']

## cli configuration

    .dlogrc

    "globPattern": "./src/**/*.?(js|jsx|ts|tsx)", - glob for files to include.
    "excludes": "node_modules|\\.test",  - regExp applied to exclude from files found by globbing.
    "module" : "e.g: es2015/commonjs.    - Added on $ dlog i depending on choice of module system",
    "nameAs" : "dlog/whateverLog        - auto added log identifier can be changed to avoid name clashes.",
    "argCheck" : true/false             - adds arguments to logging for named param comparison.

## runtime configuration

    dlogger.js. Customisation of logging.

    config = {
        include: ['*'],         // '*' - every named log call. or 'foo', 'bar' -exact matches.
        exclude: [],            // array of exact matches to exclude.
        globalLogger: 'd',   // name a global convenience logger.
        argCheck : true,        // warn if actual arguments passed differ from named parameters.
        typeCheck: false,       // deep compare paramater data types.
        timing: true,           // ms timing between logged function calls.
        file: true,             // if true, shows the origin file of the log.
    };

    globalLogger: set the name of the logger (default here d), require once early in
    application boot sequence e.g:

        require('../dlogger.js') //no assignment necessary.
        // now in any file can use:
        d.log({myTag: {p1, p2}})

    If prefered you can avoid global and require in explicitly:

        const d = require('../dlog.js')

    Globals are usually an anti-pattern, but dlog is intended to be fast in, fast out at development time, so acceptable as should never be pushed.

## .log API

console.log is a very flexible api. And is often used thus:

    console.log ( "some indentifier : ", "p1: ", p1, " p2: ", p2 );

dlog.log enforces:

    dlog.log ( { someIdentifier : {p1, p2 } }, {/* optional meta-data */ } )

| .log( {} ) rule                     |                     psudocode |
| ----------------------------------- | ----------------------------: |
| First param is an object.           |                       ( { } ) |
| With one first level Key.           |           ( { identifer : } ) |
| The identifier's value is an object |       ( { identifer : { } } ) |
| Containing the paramaters           | ( { identifer : {p1, p2 } } ) |

With ES6 destructuring you can do this already with console.log, but dlog enforces the structure.
Logs should be structured code, not any arbitrary mix of types. By using such a standard the quality and usefulness of all your logging can be much improved.

## workflow

- requires source is under git control. (dlog can potential change a lot of files, so this is a safety feature).
- warns if git is not clean (i.e. un-staged files)
- dlog blats your codebase with logging. Just like console.logs it should not be pushed. To that end we recommend using at least a pre-commit hook (easily done with husky). > dlog ? will halt the commit if an logs are in source folder.
- must run dlog at command line in dir that has package.json and be git initialised.

## examples

- Browser and Node examples √
- example integration with other loggers e.g. Winston. √
- walkthrough production size code base - Spectrum chat. - coming
- type checking depth/execution control - coming
- Log server - maybe coming

## experimental features:
    typeCheck has no depth/time limit checking, so can suck time. Dont run it against react props for now which can be enormously deep objects!

### typeCheck

With typeCheck=true, logging keeps track of function call paramater types and alerts you when they change as a type anomoly. for example:

    foo(astring: '', anumber: 42, anarray: [10,20,30])

    # later called with:
    foo(astring: '', anumber: 42, anarray: [10,"20",30])
    # logs :
    type anomoly detected:
    foo.anarray was [numbers] got [numbers, strings]

    # deep object comparison:

    bar ({ a: { b: { c: {astring: '', anumber: 42, anarray: [10,20,30]}}}})
    # later called with:
    bar ({ a: { b: { c: {astring: '', anumber: 42, anarray: [10,20,/\\/g ]}}}})

    # logs:
    type anomoly detected:
    bar.a.b.c.anarray was [Numbers] got [Numbers, Regexs]

### argCheck

    if config.argCheck = true on (both in .dlogrc, and dlogger.js config),
    arguments passed are compared against named paramaters. 

### Roadmap

V 1.0 Key Target Use Case.

Reusable code walk through execution scenario's to rapidly ramp up new developers to unfamiliar/complex code bases.

### Rationale ( the unapollageticly opinionated bit -)

- Execution trumps code. Just as rivers the river banks are not the river. Dlog is about making exection flow views tanglible reusable, sharable.

- Debuggers run code in synthetic environments, which can lead to false positive behaviours (especially for asynchronous, and time affected operations). Automated logging is more effective (with dlog).

- Developers need fast, actually immediate tools to explore execution flows. Stacktraces have too much noise to signal.

- Dlog autmates logging for named functions only. Named functions are (or should be) the black boxes that matter in any code base. (and if they are not, using Dlog will help refactor to let it be so).


## release notes

### v0.3.3
    - dlogger.js renamed dlog.js
    - tlog.log (example global logger) renamed d.log

### v0.3.2
    - cli output to stdout better formatting.
    - verbose logger example added to dlogger.js.


### v0.3.1

- Api breaking changes:

  - config.meta: Removed. meta wrapper not helpful to api. meta.file, meta.timeStamp moved up to just config.

- new features:
  - argCheck: see examples/1-node-simple. to enable dlogger config.argCheck : true.
  - timing: timeStamp renamed timing. gives millisecond timing between logs.
  - globPattern - parent dir '../' prevented for dlog cli operations.
  - ES6 destructuring arguments ' => ({}) exculded from auto logging as false positive named functions.
  - export.functName - autlogged.
  - export default function -unnamed, logged as the file name, or parent dir if file named index.
  - note, ignores multi-line function signatures. (to be implemented)
  - auto indentation.

### v0.1.5

- cli: dlog +

  - works with object deconstruction in function params.
  - ignores single line // commented out functions.
 

- dlogger Runtime

  - outputLogger config. enables upstreaming to any logger.
    - Node example with Winston.
    - Web example with Logrocket.

- Non functionals:

  - husky pre-commit hook, lint, test.

### v0.1.4

- config.outputLogger - configure dlog to use other logging libraries.
- examples/cutsom-logger-winston provided.
- Stability and code quality refactoring.

### v0.1.3

- Stability and code quality refactoring.

### v0.1.0

- logging packaged as UMD so works for web as well as node.
- \$ dlog i - asks if for web/node and adds logger config accordingly.
- dlog.config.json name changed to .dlogrc.
- optional global logger as standard example in dlogger.js.
- examples - web and node with global and imported/required logging.
- coveralls

### v0.0.7

- Dlog is ready to try but admittedly rough.
- Looking for feedback if you find positive uses and see the potential in the library. - Thanks && enjoy.

## local only npm installation

All global packages really do is allow you to type less at command line:

    # with globally installed:
    > dlog +/-/?/v/h

    # instead of
    $ node node_moudules/@genisense/dlog/src/cli/dlog +/-/?/v/h

    # or add to package.json:
    scripts : {
        "dlog" : "node_moudules/@genisense/dlog/src/cli/dlog"
    }
    # then can use slightly shorter
    $ npm run dlog +/-/?/v/h
