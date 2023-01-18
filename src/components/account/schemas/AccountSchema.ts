const properties = {
  email: { type: 'string' },
  password: { type: 'string' },
};

export const createSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties,
};
