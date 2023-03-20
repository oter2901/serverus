import { NotNullViolationError } from 'objection-db-errors';

import BaseException from '../exceptions/BaseException';
import { NotNullError } from '../exceptions/Errors';
import LoggerFactory from '../utils/Logger';

const { logger } = new LoggerFactory('DatabaseErrorHandler');

export function DatabaseErrorHandler(err: Error) {
  if (err instanceof NotNullViolationError) {
    logger.error(err);
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
