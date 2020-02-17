const { createLogger, format, transports } = require('winston');
const { printf } = format;

const dlogWinstonFormat = printf(({ level, message }) => {
  return `[dlog winston] ${level} : ${message}`;
});

const winstonLogger = createLogger({
  level: 'info',
  format: dlogWinstonFormat,
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

module.exports = winstonLogger;
