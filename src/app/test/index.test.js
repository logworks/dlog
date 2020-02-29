const dlog = require('../index');

const config = {
  include: ['*'],
  exclude: ['x'],
  globalLogger: 'd',
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
    logger.outputLogger = args => {
      expect(allowedLog).toEqual({ ok: {} });
    }
    allowedLog = logger.log({ ok: {} });
  });

  it('excludes logs matching exclude', () => {
    logger.outputLogger = args => {
      //should not be called. -TODO spy
      expect(false).toBe(true)
    }
    excludelogger = logger.log({ x: {} });
    expect(excludelogger).toBe(null);
  });
});

describe('logging with extra configuration options', () => {

  xit('logs ms timing when config.timing = true', () => {
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
