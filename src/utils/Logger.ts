import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

import { LOG_DIR } from '../configs/AppConfig';

const logsDirectory: string = join(__dirname, LOG_DIR);
const loggerInstances = new Map<string, LoggerFactory>();

export default class LoggerFactory {
  public logger: winston.Logger;

  public static getInstance(label: string) {
    const instance = loggerInstances.get(label);
    if (instance) return instance;

    return new LoggerFactory(label);
  }

  constructor(label: string) {
    if (!existsSync(logsDirectory)) {
      mkdirSync(logsDirectory);
    }
    this.logger = winston.createLogger({
      format: this.getLoggerFormats(label),
      transports: Object.values(this.getLoggerTransports()),
    });
    this.logger.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
      }),
    );

    loggerInstances.set(label, this);
  }

  private getLoggerFormats = (label: string) => {
    const formatLabel = winston.format.label({
      label: label,
    });
    const formatTimestamp = winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    });
    const formatPrintf = winston.format.printf(({ level, message, label, timestamp, stack }) => {
      return `${timestamp} ${level} [${label}] ${message} ${stack ? stack : ''}`;
    });

    return winston.format.combine(formatLabel, formatTimestamp, formatPrintf);
  };

  private getLoggerTransports = () => {
    const debugTransport = new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logsDirectory + '/debug',
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    });
    const errorTransport = new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logsDirectory + '/error',
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    });
    return { debugTransport, errorTransport };
  };
}
