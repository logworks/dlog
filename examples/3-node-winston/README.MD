# Custom logger - Winston

Example of passing the logging onto an upstread logger, in this case
the widely used and rather excellent Winston.

## Walk through:

- Winston configuration in ./winstonLogger.js
- dlogger.js requires in winstonLogger.js
- dlogger sets config outputLogger: winstonLoggerTransform.
- winstonLoggerTransform defined in dlogger, adapts structure to Winston's format.

## notes:

Simlar approach for other client side log libraries (Sentry, rollbar, etc).

The example is first pass tracer code. You can probably ditch the winstonLoggerTransform and go direct to Winston by using its custom formatters. Useful I think to show a simple transform option anyway.
