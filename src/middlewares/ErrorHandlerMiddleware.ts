import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../interfaces/CustomError';
import LoggerFactory from '../utils/Logger';

const { logger } = new LoggerFactory('ErrorHandlerMiddleware');

export function handleError(err: CustomError, _req: Request, res: Response) {
  const { status, validationErrors, ...rest } = err;
  const response = validationErrors ? [...validationErrors] : [{ message: err.message, ...rest }];

  res.status(status || 500).json(response);
}

export function logError(err: CustomError, _req: Request, _res: Response, next: NextFunction) {
  logger.error(err);
  next(err);
}
