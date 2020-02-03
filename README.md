# @genisense/dlog

Logging designed for development time.
tired of typing console.log?
Love the dynamic nature of javascript?
Would like an automated alternative/supplement to Typescript/Elm etc?
dlog might just help.

## quick start

    # in root of project you want to log (must have a package.json and be git initialised)
    npm i -D @genisense/dlog
    npm i -g @genisense/dlog
    dlog i

(All the global package really does is allow you to type less at command line:)

    > dlog +/-/?/v/h
    # instead of
    > npm run dlog +/-/?/v/h

More on how to use it only locally later.

dlog i creates two files:

    dlog.config.json
    dlog.js

Edit dlog.config.json and set the globPattern and excludes to match your project. (globPattern matches the files/directories given, and excludes sets files you dont want logging added to.)

You are now ready to Log & Roll:

    # Add logging to all files specified in config:
    dlog +

    # Remove logging from all files (again specified in config:
    dlog -

You can also filter on the fly without reloading, for example if running a browser app, at the console:

    # To only log functions named foo or bar
    dlog.filtrate = ['foo','bar']

    # Log every function (that was added according to globPattern config)
    dlog.filtrate = ['*']

logging keeps track of function call paramater types and alerts you when
they change as a type anomoly. for example:

    foo(astring: '', anumber: 42, anarray: [10,20,30])

    # later called with:
    foo(astring: '', anumber: 42, anarray: [10,"20",30])
    # logs :
    type anomoly detected:
    foo.anarray was [numbers] got [numbers, strings]

    # works to any object depth:

    bar ({ a: { b: { c: {astring: '', anumber: 42, anarray: [10,20,30]}}}})
    # later called with:
    bar ({ a: { b: { c: {astring: '', anumber: 42, anarray: [10,20,/\\/g ]}}}})

    # logs:
    type anomoly detected:
    bar.a.b.c.anarray was [numbers] got [Numbers, Regexs]

## examples

Soon come:

- basic use
- integration with other loggers e.g. Winston.
- middleware

## workflow

- requires source is under git control. (dlog can potential change a lot of files, so this is a safety feature).
- warns if git is not clean (i.e. un-staged files)
- dlog blats your codebase with logging. Just like console.logs it should not be pushed. To that end we recommend using at least a pre-commit hook (easily done with husky). > dlog ? will halt the commit if an logs are in source folder.

## release notes

This is version 0.0.7. Dlog is ready to try but admittedly rough. Looking for feedback if you find positive uses and see the potential in the library. Thanks && enjoy.
