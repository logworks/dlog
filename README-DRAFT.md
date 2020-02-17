## roadmap

- cli: dlog +
  - argCheck option. warns when named paramater count differs to actual paramaters recieved. TODO 3
  - works for spread params: function (...args) TODO 2
  -
- Non functionals:

  - refactored cli Q&A, tests.TODO
  - husky pre-push dlog ? check (eating own dog food) TODO 1
  - tests & refactoring of cli stdin, stdout. TODO 2
  - remove gist dependency TODO
  - improve perf for typechecking TODO
  - readme - link to coverage instead of badge. TODO (We are not 100% coverage slaves. Behaviours are the way).

- TypeChecker

  - better formated output. TODO 3
  - timeout if object too complex to be checked at runtime. TODO 3
  - perf tests. TODO 3

# dlog - logging designed for @development time.

Auto log entire code bases, with filtering, and dynamic type checking.

Tired of typing console.log? Or want to understand some code better quickly?
Then dlog was made for you.

## Overview

dlog was born of the frustration of tapping out console.log.
X Such a clunky manual process is extremely dispruptive to flow.

For too long logging has been an awful developer experience (DX). 90% of effort bug fixing is finding the issue in the first place. The current primary tools are console.log and debuggers.
Neither are flowthy - interupting the focused stream of thought needed to programme.

The code is the guide, not the exectuion. Execution is more important that code, but it is hidden behind a veil of poor log tooling. I hope that the novel approach of dlog opens up a new angle to approach programming. On the roadmap is runtime duck type checking, which for some projects could replace proptypes / typescript etc.

So imagine you could simply do this for entire application:

    dlog.filter = ['functionName1', 'moduleName1']

and drill into exactly what you want to actually see of the execution.

Unappologetically opinionated - The only things you need to log are functions - their names and paramaters.
If your code is developer friendly it will have small well named functions that take well defined inputs. And the next function called, and so on and so on.

And hey, if this is not the case for the code base, dlog will encourage this approach.
To debug / explore code execution black box functions are the best single perspective. I warned you this is highly opinionated - but i hope you agree that can be a good thing!

- Aims to do one thing - development time logging well.
- auto add/remove/check logging for any/all function calls and paramaters.
- ?Never type console.log ever again : \$ dlog on, and the job is done.

- Filter by function or module or call stack parents: dlog.filter('functionName1', 'moduleName1')
- Save filters - assign to git issues for log filter set reuse - enable debugging like a boss for entire team regardless of team/code base sizes.
- Understand code bases faster - see the execution flow with virtually no effort. Supports reusable code walkthroughs.
- Change filters on the fly at runtime. No reload required.
- cli with batteries included.
- examples for use in production, source control workflow, CI.
- vs-code plugin.
- works with other logging lbraries.

## quick-start

### install

    npm i -D @genisense/dlog

### Command line interface

    "scripts": {
         "dlog:add": "node node_modules/dlog/src/cli/dlog.js -a",
        "dlog:remove": "node node_modules/dlog/src/cli/dlog.js -r",
        "dlog:check": "node node_modules/dlog/src/cli/dlog.js -t",src/cli/dlog.js"
    },
    "dlog": {
        "rootDir": "./src",
        "files": {
        "includes": ".js, .jsx, .ts, .tsx",
        "excludes": "*test*, *spec*, *config*, dlog, *.json"
        },
        "filters": {
        "all": "",
        "core": "core, util"
        }
    }

Note the dlog configuration section is also required.
Any program like dlog which changes files is potentially dangerous so:
dlog cli must :

- be run from root dir of app.
- at same level as package.json
- said package.json must contain valid dlog configuration.
- The app must be under git source control.
- And the app will warn giving the option to quit if the git status is not clean.

then to run:

    npm run dlog

with no options help will be shown:

If npm run is too verbose add an alias:

    echo "alias dlog='node ./node_modules/dlog/src/cli/dlog.js'" >> ~/.bash_profile
    source ~/.bash_profile

caveat- need to be in root dir of project with dlog installed - but this is the norm. Can even think of it as a safety feature! The rest of this readme will assume you have aliased dlog, so i dont have to type an extra seven letters!

for your convenience npm i -g dlog will work

Initialise dlog:

    dlog init

This takes you through configuration options, producing a ./dlog.js.

To seed the codebase with logging:

    dlog in

Note - you will be warned if git status is not clean.

And to remove:

    dlog out

Run your code, every single named function call will be logged with paramaters.

#### Filtering

### Now a warning!

[seriously dudes & dudettes, do this on first day of deciding to use dlog]

It is highly recommended you prevent dlog (remember its development time logging) from entering production.

- A. the extra function calls will harm performance.
- B. Worse - It will flood the server logs, exhausting diskspace/costing you a fortune in cloud storage.

Examples of how to set this up with pre-push / CI ....

## Workflow

pre-push hook. -example
build process clean dlog from code. -example

## Integration

It is easy to configure dlog to output to any upstream logging mechanism.
The default is to console, here is an example of integrating with Winston.

You can leverage the goodness of dlog for production.
dlog init gives the option to have a differently named production log name. The default name is plog. If you dont want the hit of an extra function call, you can configure it to be whatever you want - console.log, winston etc.

vs-code plugin.

## examples

- quick start
- pre-push hook with husky
- travis clean log continuous integration
- upstreaming winston
- code hiding - maybe

switched to webpack - with imports instead of requires for source.
webpack converts to umd. -? why cant keep as requires ?

breaks test - looking at bable magickary to fix tests.
seem route of work for no gain - damn tooling!
parking it, get some advice, sleep on it.

Cannot read property 'bindings' of null
../node_modules/@babel/core/node_modules/@babel/traverse/lib/scope/index.js

====== // /\* comment notes removed:

// app/index todo:
// enforce structure
// configurable log.
// default log all if filtrate empty

/\*
callDiff
stack tracks hash of function calls (filename, line)
The param values are converted to type identifiers.
When subsequently called if the types vary,
the logger provides the diff.

Note:

to move to logging server when build one.

stack in memory, unmanaged - another reason to move to server,
remove from app perf, caching options like redis on server.

look for colorised diff for console:
jasmine / https://github.com/flitbit/diff ?

\*/

TypeChecker

/_
returns object of same structure as srcObject
with values replaced by types.
_/
