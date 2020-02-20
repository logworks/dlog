const dlog = require('./index');

const config = {
  include: ['*'],
  exclude: ['x'],
  globalLogger: 'tlog',
  outputLogger: console.log,
  typeCheck: false,
  timing: false,
  file: false
};
const logger = dlog.createLogger(config);

if (config.globalLogger) {
  global[config.globalLogger] = logger;
}

describe('basic logging without advanced configuration options', () => {
  it('throws an error if invalid paramater -not an Object is passed.', () => {
    try {
      logger.log('astring');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('throws an error if invalid paramater Object with more than one root key.', () => {
    try {
      logger.log({ a: {}, b: {} });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('allows logs matching include', () => {
    allowedLog = logger.log({ ok: {} });
    expect(allowedLog).toEqual({ ok: {} });
  });

  it('excludes logs matching exclude', () => {
    excludelogger = logger.log({ x: {} });
    expect(excludelogger).toBe(undefined);
  });
});

describe('logging with extra configuration options', () => {

  it('logs ms timing when config.timing = true', () => {
    logger.config.timing = true
    logger.config.outputLogger = (...args) => {
      expect(args).toEqual([{ firstTime: {} }]);
    }
    logger.log({ firstTime: {} });
    logger.config.outputLogger = (...args) => {
      expect(args).toEqual([{ secondTime: {} }, { timing: "1ms" }]);
    }
    logger.log({ secondTime: {} });
  });

});
