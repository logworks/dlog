# @genisense/dlog


[![Build Status](https://travis-ci.com/logworks/dlog.svg?branch=master)](https://travis-ci.com/logworks/dlog)
[![Coverage Status](https://coveralls.io/repos/github/logworks/dlog/badge.svg?branch=master)](https://coveralls.io/github/logworks/dlog?branch=master)

Logging focused at development time.
Aim :- 100% Automatic unobtrusive, zero coding, exploratory logging/debugging tool.

## terminal output:
<p align="left">
<img src="https://user-images.githubusercontent.com/60403446/75459955-bff9fb00-5978-11ea-8da1-4ab157e7c859.png">
</p>

## web dev-tools output:
<p align="left">
<img src="https://user-images.githubusercontent.com/60403446/75460199-123b1c00-5979-11ea-95e8-49ece57ffe92.png">
</p>


The above shows standard output from dlog's auto-logging named function summary: 

- overridable, configurable, upstreamable.
- Colorized ms timing (time of arrival from previous function call).
- function name.
- Named parameters :infered param types. 
- Timing metrics are indicative of time between log calls.
- d.r() reports:
  - most frequently called functions.
  - slowest.


Pre v1.0.0: [v 0.4.2](./RELEASES.md) early POC so API is frequently changing (re-run $ dlog i when updating)

## install

    $ npm i -g @genisense/dlog
    $ npm i -D @genisense/dlog #or yarn add -D
    $ dlog i # initialise
 
dlog i creates two files:

    ./.dlogrc  // cli configuration.
    ./dlog.js  // runtime configuration.
  
edit .dlogrc to set source dir / dlog.js location.

### Cli commands:

    $ dlog +        # auto-logs every named function.
    $ dlog -        # removes all logs added by dlog +.
    $ dlog h        # help
    $ dlog ?        # halts for CI if dlog present in code pre-push.

Run application (node or browser), at console:

    d.log( { label: { param1, param2 } } ) // cleaner, easier than console.log
    d.r() // report metrics, anomolies, suggests.
    d.config // log config on the fly.


You can filter without reloading, for example if running a browser app, at the console:

    # with globalLogger set in dlog.js, can change config from console
   
    # only log functions named foo or bar
    d.config.include = ['foo','bar']

    # see more details for particular functions:
    # d.config.includeDetails = ['foo']

    # Log every function (that was added according to globPattern config)
    d.config.include = ['*']

    # exclude specific functioins - useful to quiet chatty ones:
    d.config.exclude = ['onMouseMove']

## cli configuration

.dlogrc:

    "globPattern": "./src/**/*.?(js|jsx|ts|tsx)", - glob for files to include.
    "excludes": "node_modules|\\.test",  - regExp applied to exclude from files found by globbing.
    "module" : "e.g: es2015/commonjs.    - Added on $ dlog i depending on choice of module system",
    "nameAs" : "dlog/whateverLog        - auto added log identifier can be changed to avoid name clashes.",
    "localDlogPath" : "./src/dlog.js",  -dlog put in root by default. if you move it, say to src, set this to match.
    


## workflow

- requires source is under git control. (dlog can potential change a lot of files, so this is a safety feature).
- warns if git is not clean (i.e. un-staged files)
- dlog blats your codebase with logging. Just like console.logs it should not be pushed. To that end we recommend using at least a pre-commit hook (easily done with husky). $ dlog ? will halt the commit if any automatic dlogs are in source folder.
- Must run $ dlog at command line in dir that has package.json and be git initialised.


## features:

### includeDetails

    d.config.includeDetails = ['foo']
    // or persist changes to config in dlog.js

Details of functions named here output additional info:
 - stack breadcrumb summary. >> foo > bar > baz
 - stack : files and lines of parent calls.
 - Full output of parameter data.

This is probably the feature you will use the most.

### .log API

Most of the features of dlog are aimed squarely at automatic logging.
However, it can also be used as a replacement for console.log during development/debugging. Why?

console.log is a very flexible api. And is often used thus:

    console.log ( "some indentifier : ", "p1: ", p1, " p2: ", p2 );

d.log enforces:

    d.log ( { someIdentifier : {p1, p2 } } )

| .log( {} ) rule                     |                     psudocode |
| ----------------------------------- | ----------------------------: |
| First param is an object.           |                       ( { } ) |
| With one first level Key.           |           ( { identifer : } ) |
| The identifier's value is an object |       ( { identifer : { } } ) |
| Containing the paramaters           | ( { identifer : {p1, p2 } } ) |

With ES6 destructuring you can do this already with console.log, but dlog enforces the structure.
Logs should be structured code, not any arbitrary mix of strings and types. By using dlog to enforce such a standard the quality and usefulness of all your logging can be much improved.

globalLogger: set the name of the logger (default here d), require once early in
application boot sequence e.g:

        require('../dlogger.js') //no assignment necessary.
        // now in any file can use:
        d.log({myTag: {p1, p2}})

    If prefered you can avoid global and require in explicitly:

        const d = require('../dlog.js')

Globals are usually an anti-pattern, but dlog is intended to be fast in, fast out at development time, so acceptable as should never be pushed.


### argCheck option

Arguments passed are compared against named paramaters. Useful to alert when they mismatch.

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

## examples

- Browser and Node examples √
- example integration with other loggers e.g. Winston. √
- walkthrough production size code base - Spectrum chat. - coming
- type checking depth/execution control - coming
- Log server - maybe coming


## local only npm installation

All global packages really do is allow you to type less at command line:

    # with dlog globally installed:
    $ dlog +/-/?/v/h

    # instead of
    $ node node_modules/@genisense/dlog/src/cli/dlog +/-/?/v/h

    # or add to package.json:
    scripts : {
        "dlog" : "node_modules/@genisense/dlog/src/cli/dlog"
    }
    # then can use slightly shorter
    $ npm run dlog +/-/?/v/h
