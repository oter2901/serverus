import _ from 'lodash';
import * as Errors from './Errors';

const DEFAULT_KEYWORD = 'error';

const createFromDataPath = error => {
  const { message, data, dataPath, params = {} } = error;
  const { allowedValues } = params;

  const key = dataPath.replace('.', '');
  let messageWithKey = `${key}: ${message}`;

  if (!_.isEmpty(allowedValues)) {
    messageWithKey = `${messageWithKey} [${allowedValues}];`;
  }

  return { message: messageWithKey, data: { [key]: data } };
};

const createFromKeyword = ({ params, message }) => {
  const messageWithKey = Object.values(params).reduce((msg, value) => `${msg}${value}: ${message};`, '');

  return { message: messageWithKey, data: {} };
};

const mapErrors = (errors: any[], code: number) =>
  errors.reduce((arrayResult, error) => {
    const { dataPath } = error;

    const errorObj = !dataPath || dataPath === '' ? createFromKeyword(error) : createFromDataPath(error);

    return [...arrayResult, { code, ...errorObj }];
  }, []);

class ValidationError extends Error {
  public status: number;
  public code: number;
  public message: string;
  public validationErrors: any[];

  constructor(properties: { status?: 400; code?: number; errors?: any[] }) {
    const { status = 400, code = Errors.ValidationError.code, errors = [] } = properties;
    super(String(Errors.ValidationError.code));
    this.status = status;
    this.code = code;
    this.message = Errors.ValidationError.message;
    this.validationErrors = mapErrors(errors, code);
  }

  static buildFromMessage(message: string) {
    return new ValidationError({ errors: [{ keyword: DEFAULT_KEYWORD, message, params: {} }] });
  }
}

export default ValidationError;
