# @genisense/dlog

[![Build Status](https://travis-ci.com/logworks/dlog.svg?branch=master)](https://travis-ci.com/logworks/dlog)
[![Coverage Status](https://coveralls.io/repos/github/logworks/dlog/badge.svg?branch=master)](https://coveralls.io/github/logworks/dlog?branch=master)

Logging designed for development time.
Tired of typing console.log? - '\$ dlog +' logs all named functions. 'dlog -' removes.
Runtime dynamic type checking for hard to find bugs.
Logs as code, not strings.
Useful for large code base investigation. See the execution flows and details fast.

Useful tool for debugging. Debuggers run code in a synthetic environment, which can lead to non real behaviours (especially for asynchronous, and time affected operations). Try dlog powered up logging instead.

Note Pre-release. [v 0.1.6](#v0.1.6) Usable, still early POC, let us know if you find potentially useful.

## quick start

    npm i -D @genisense/dlog
    npm i -g @genisense/dlog
    dlog i

dlog i creates two files:

    .dlogrc  // cli configuration.
    dlogger.js  // runtime configuration, customisation.

Edit .dlogrc. Set the globPattern and excludes to match your project. (globPattern matches the files/directories given, and exclude sets files you dont want logging added to.)

You are now ready to Log & Roll:

    # Add logging to all files specified in config:
    $ dlog +

    # Remove logging from all files (again specified in config:
    $ dlog -

You can also filter on the fly without reloading, for example if running a browser app, at the console:

    # To only log functions named foo or bar
    dlog.config.include = ['foo','bar']

    # Log every function (that was added according to globPattern config)
    dlog.config.include = ['*']

    #exclude specific functioins - useful for chatty ones:
    dlog.config.exclude = ['onMouseMove']

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

## cli configuration

    .dlogrc

    "globPattern": "./src/**/*.?(js|jsx|ts|tsx)", //glob for files to include.
    "excludes": "node_modules|\\.test",  // regExp applied to exclude from files found by globbing.
    "module" : "e.g: es2015/commonjs.    - Added on $ dlog i depending on choice of module system",
    "nameAs" : "dlog/whateverLog    - auto added log identifier can be changed to avoid name clashes."

## runtime configuration

    dlogger.js. Customisation of logging.

    config = {
        include: ['*'],         // '*' - every named log call. or 'foo', 'bar' -exact matches.
        exclude: [],            // array of exact matches to exclude.
        globalLogger: 'tlog',   // name a global convenience logger.
        argCheck : true,        // warn if actual arguments passed differ from named parameters.
        typeCheck: false,       // deep compare paramater data types.
        meta: {
            timeStamp: true,    // if true, timestamp added to every log
            file: true         // if true, shows the origin file of the log.
        }
    };

    globalLogger: set the name of the logger (default here tlog), require once early in
    application boot sequence e.g:

        require('../dlogger.js') //no assignment necessary.
        // now in any file can use:
        tlog.log({myTag: {p1, p2}})

    If prefered you can avoid global and require in exlicitly:

        const tlog = require('../dlogger.js')

    Globals are an anti-pattern, but dlog is intended to be fast in, fast out at development time, so acceptable as should never be pushed.

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
- type checking depth/execution control - coming
- middleware.
- Log server - maybe coming

## release notes

### v0.1.6

    argCheck:   see examples/1-node-simple. to enable dlogger config.argCheck : true.

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
