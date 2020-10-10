const winston = require('winston');
require('winston-daily-rotate-file');
const expressWinston = require('express-winston');
const moment = require('moment-timezone');
const path = require('path');

const loggerFormat = winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${JSON.stringify(info.meta)}`);
const convertTimeZone = winston.format((info, opts) => {
  if (opts.tz) info.timestamp = moment().tz(opts.tz).format();
  return info;
});
const requestsLogger = expressWinston.logger({
  transports: [new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '..', 'logs', 'requests-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    maxsize: '2m',
    maxFiles: '7d',
    zippedArchive: true,
  })],
  format: winston.format.combine(
    convertTimeZone({ tz: 'Europe/Moscow' }),
    loggerFormat,
  ),
});

const errorsLogger = expressWinston.errorLogger({
  transports: [new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '..', 'logs', 'errors-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxsize: '2m',
    maxFiles: '7d',
    zippedArchive: true,
  })],
  format: winston.format.combine(
    convertTimeZone({ tz: 'Europe/Moscow' }),
    loggerFormat,
  ),
});

module.exports = { requestsLogger, errorsLogger };
