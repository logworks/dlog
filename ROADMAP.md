# Roadmap

Goal is a v 1.0 release:
- simple, hackable open source code.
- functional composition over classes.
- build robust really useful features for
   - debugging.
   - code exploration.
   - code walk throughs.
  

### Rationale ( the unapollageticly opinionated bit -)

- Execution trumps code. Just as the river banks are not the river. Dlog's aim is to help experience exection flow.

- Debuggers run code in synthetic environments, which can lead to false positive behaviours (especially for asynchronous, and time affected operations). Automated logging is a useful alternative/adjunct.

- Developers need fast, actually immediate tools to explore execution flows. Stacktraces have too much noise to signal.

- Dlog autmates logging for named functions only. Named functions are (or should be) the black boxes that matter in any code base. (and if they are not, using Dlog will help refactor to let it be so).

