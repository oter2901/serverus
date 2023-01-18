import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = environment.PORT || 3000;

export const LOG_DIR = environment.LOG_DIR || '../logs';
export const LOG_FORMAT = environment.LOG_FORMAT || 'dev';

export const ORIGIN = environment.ORIGIN || '*';
export const CREDENTIALS = String(environment.CREDENTIALS) === 'true' || false;

export const SECRET_KEY = environment.SECRET_KEY || 'super-secret-key';
