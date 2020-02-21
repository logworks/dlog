const setupLogging = () => {

  const logHeadline = (args) => {
    const getType = elem => {
      return Object.prototype.toString.call(elem).slice(8, -1);
    };
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
    console.log(params)
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

  if (config.globalLogger) {
    window[config.globalLogger] = logger;
  }
};

const boot = () => {
  setupLogging();
  d.log({
    example: {
      p1:
        'dlog used for automated function logging (reoved and added with dlog cli',
      p2: 'another param',
      p3: { going: { deeper: { a: 1, b: /\\\\/ } } },
      p4: { goingSeriously: { deeper: { andDeeper: { andEvenDeeper: [1, 2, 3, 4, 5, 6, 7, 'a', 'b', 'c'] } } } }
    }
  });
};

boot();
