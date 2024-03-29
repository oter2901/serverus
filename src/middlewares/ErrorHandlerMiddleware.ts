import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import { DatabaseErrorHandler } from '../handlers/DatabaseErrorHandler';
import { CustomError } from '../interfaces/CustomError';
import LoggerFactory from '../utils/Logger';

const { logger } = new LoggerFactory('ErrorHandlerMiddleware');

export function logError(err: CustomError, _req: Request, _res: Response, next: NextFunction) {
  logger.error(err);
  next(err);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleError(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const databaseError = DatabaseErrorHandler(err);

  const error = _.isEmpty(databaseError) ? err : databaseError;
  const { status, validationErrors, message, code } = error as CustomError;
  const response = !_.isEmpty(validationErrors) ? [...validationErrors] : [{ message, code }];

  res.status(status || 500).json(response);
}
