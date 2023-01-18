import { ajvDefaultOptions } from '@configs/ValidationConfigs';
import Ajv from 'ajv';

import { createSchema } from '../schemas/AccountSchema';

const ajv = new Ajv(ajvDefaultOptions);

export const create = ajv.compile(createSchema);
