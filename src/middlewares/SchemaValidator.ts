import ValidationError from '@exceptions/ValidationException';
import { ValidateFunction } from 'ajv';
import { RequestHandler, Request } from 'express';

export const validateOrThrow = (validator: ValidateFunction, toValidate: {}) => {
  if (!validator(toValidate)) {
    throw new ValidationError({
      errors: validator.errors,
    });
  }
};

const validate =
  (validator: ValidateFunction, builder: (req: Request) => {}): RequestHandler =>
  (req, res, next) => {
    const toValidate = builder(req);
    validateOrThrow(validator, toValidate);
    next();
  };

export const validateIncomingData = (validator: ValidateFunction) => validate(validator, (req: Request) => req.body);
