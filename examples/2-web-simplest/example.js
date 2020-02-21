// initialise logging early in app bootup
let dlogger;
const setupLogging = () => {

  const getType = elem => {
    return Object.prototype.toString.call(elem).slice(8, -1);
  };

  /*
    customisation point.
    want machine readable, i.e. no colorization, no stringification to pass to upstream log service.
    construct summary, detail lines. √
    may move to standard log formatters within core dlog.
    colorizing :
      [dlog]  orange,
      [ms]  < 5ms green, >5 ms amber - in 3 shades, > 10 ms red - 3 shaeds. note should ignore net requests.
      functionName - assign a color by first letter or two.

  */

  const logHeadline = (args) => {
    const fName = Object.keys(args[0])[0]
    const params = Object.keys(args[0][fName])

    const paramTypes = params.map((key) => key + ':' + getType(args[0][fName][key]))

    const timing = args[1].timing || ''
    const file = args[1].file || ''
    return (`[dlog][${timing}] ${fName} (${params}) (${paramTypes}) ${file}`)
  }

  const customLogger = (...args) => {
    console.log(logHeadline(args))
    const fName = Object.keys(args[0])[0]
    const params = args[0][fName]
    //dealers choice : .log - immediatly visible. .dir - collapsed object
    console.log(params)
    // console.dir(params) 
  };
  const config = {
    include: ['*'],
    exclude: [],
    globalLogger: 'd',
    outputLogger: customLogger,
    argCheck: true,
    timing: true,
    file: true,
    typeCheck: false
  };

  const logger = dlog.createLogger(config);

  dlogger = dlog.createLogger(config);

  if (config.globalLogger) {
    window[config.globalLogger] = dlogger;
  }
};

const boot = () => {
  setupLogging();
  dlogger.log({
    componentA: {
      p1:
        'dlog used for automated function logging (reoved and added with dlog cli',
      p2: 'another param',
      p3: { going: { deeper: { a: 1, b: /\\\\/ } } },
      p4: { goingSeriously: { deeper: { andDeeper: { andEvenDeeper: [1, 2, 3, 4, 5, 6, 7, 'a', 'b', 'c'] } } } }
    }
  });
  d.log({
    globalLogging: {
      p1:
        'd.log quick access (window.d.log)'
    }
  });
};

boot();
