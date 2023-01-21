import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { LOG_DIR } from '@configs/AppConfig';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logsDirectory: string = join(__dirname, LOG_DIR);
const loggerInstances = new Map<string, LoggerFactory>();

export default class LoggerFactory extends winston.Logger {
  public static getInstance(label: string) {
    const instance = loggerInstances.get(label);
    if (instance) return instance;

    return new LoggerFactory(label);
  }

  static getLoggerFormats = (label: string) => {
    const formatLabel = winston.format.label({ label: label });
    const formatTimestamp = winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    });
    const formatPrintf = winston.format.printf(({ level, message, label, timestamp, stack }) => {
      return `${timestamp} ${level} [${label}] ${message} ${stack ? stack : ''}`;
    });

    return winston.format.combine(formatLabel, formatTimestamp, formatPrintf);
  };

  static getLoggerTransports = () => [
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logsDirectory + '/debug',
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),

    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logsDirectory + '/error',
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ];

  constructor(label: string) {
    super({ format: LoggerFactory.getLoggerFormats(label), transports: LoggerFactory.getLoggerTransports() });
    if (!existsSync(logsDirectory)) {
      mkdirSync(logsDirectory);
    }

    this.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
      }),
    );

    loggerInstances.set(label, this);
  }

  public customStream() {
    return {
      write: (message: string) => {
        this.info(message.substring(0, message.lastIndexOf('\n')));
      },
    };
  }
}
