export const ValidationError = {
  message: 'Parameters sent are invalid',
  code: 'VALIDATION_ERROR_400',
};
export const ResourceNotFoundError = {
  message: 'Resource Not Found',
  code: 'RESOURCE_NOT_FOUND_404',
};
export const NotNullError = {
  message: 'Columns {{columns}} of table {{table}} should not be null',
  code: 'NOT_NULL_ERROR_',
};

export const EncryptionError = ValidationError;
