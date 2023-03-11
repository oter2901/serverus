import { NotNullViolationError } from 'objection-db-errors';

import BaseException from '../exceptions/BaseException';
import { NotNullError } from '../exceptions/Errors';
import LoggerFactory from '../utils/Logger';

const { logger } = new LoggerFactory('DatabaseErrorHandler');

export function DatabaseErrorHandler(err: Error) {
  logger.error(err);

  if (err instanceof NotNullViolationError) {
    return new BaseException({
      ...NotNullError,
      data: {
        column: err.column,
        table: err.table,
      },
    });
  }

  return {};
}
