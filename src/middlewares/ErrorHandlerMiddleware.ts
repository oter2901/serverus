import { HttpException } from '@exceptions/HttpException';
import LoggerFactory from '@utils/Logger';
import { NextFunction, Request, Response } from 'express';

const logger = new LoggerFactory(__filename);

const errorHandlerMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorHandlerMiddleware;
