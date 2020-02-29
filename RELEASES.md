## Release notes

### v0.5.0
  - logs for default module.exports = () =>  / function (). tags with file name/ parent dir if named index.
  - class member functions now log (regression fix).
  - refactoring.

### v0.4.4
  - unnamed module exports (module.exports = / export default) tag autolog with module filename.
  - if module file name is index, tag autolog with directory name.

### v0.4.2
  - stack breadcrumbs moved from details. default dlog.js shows on summary line.
  - colorize param types.
  - dlog + edge case: ...args
  - dlog + ensure log added immediatly after function body open {

### v0.4.0
    - workaround for webpack baking color detection for terminal.
    - all console output now done from outputLogger.
    - outputLogger required, removed default console.log.
    - includeDetail config option. gives stack breadcrumbs, stack, full param data.
    - for autologging, arguments always added to meta. .dlogrc argCheck option redundant.

### v0.3.43
    - colorised terminal output.
    - devToolInColor() formatter marked for deprecation in favour of colorizedSummary()
    - colorizedSummary works for tty & web dev consoles.
    - Can put dlog.js in src or wherever now, just configure path in .dlogrc "localDlogPath"
    - d.r() tabularised.
    - $ dlog +, reports files changed.

### v0.3.3

    - dlogger.js renamed dlog.js
    - tlog.log (example global logger) renamed d.log
    - d.r() doctor doctor - gives ten slowest and ten most called functions summary.
    - better console formatting.

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

* dlogger Runtime

  - outputLogger config. enables upstreaming to any logger.
    - Node example with Winston.
    - Web example with Logrocket.

* Non functionals:

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
