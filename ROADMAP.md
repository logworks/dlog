# Roadmap

Goal is a v 1.0 release:
- simple, hackable open source code.
- functional composition over classes.
- build robust really useful features for
   - debugging.
   - code exploration.
   - code walk throughs.


# V 0.6.0 target

   - Work for monorepos in one pass.
   - option to dlog into node_modules in one pass.
   - module system detection as option (detect/es2015/commonjs)
   - tag member fuctions with className.
   - factor in multi-line function signatures, /* comments */, `backtick multi-line strings`
   - Improved dlog + :
     - log summary info, dir, file, function detail to .log-dlog/
   - Improved filtering
     - by param names.
  

### Rationale ( the unapollageticly opinionated bit -)

- Execution trumps code. Just as the river banks are not the river. Dlog's aim is to help experience exection flow.

- Debuggers run code in synthetic environments, which can lead to false positive behaviours (especially for asynchronous, and time affected operations). Automated logging is a useful alternative/adjunct.

- Developers need fast, actually immediate tools to explore execution flows. Stacktraces have too much noise to signal.

- Dlog autmates logging for named functions only. Named functions are (or should be) the black boxes that matter in any code base. (and if they are not, using Dlog will help refactor to let it be so).

