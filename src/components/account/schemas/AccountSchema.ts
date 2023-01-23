const properties = {
  email: { type: 'string' },
  password: { type: 'string' },
  externalId: { type: 'string' },
  externalType: { type: 'string' },
};

export const createSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties,
};
