import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

// DB CONFIG
export const CONNECTION = environment.PG_CONNECTION || 'postgres://nameless:secret@localhost:5432/serverus';
export const TIMEOUT = parseInt(environment.DB_TIMEOUT || '200', 10);
export const CONNECTION_KEEP_ALIVE_TIMEOUT = parseInt(environment.CONNECTION_KEEP_ALIVE_TIMEOUT || '60000', 10);
export const CONNECTION_POOL_SIZE = parseInt(environment.DB_CONNECTION_POOL_SIZE || '20', 10);
export const DEBUG = environment.DB_DEBUG === 'true' || true;

// TABLE NAMES
export const MIGRATIONS_TABLE = 'knex_migrations';
export const ACCOUNT_STATUS_TYPE_TABLE = 'account_status_types';
export const EXTERNAL_AUTH_TYPE_TABLE = 'external_auth_types';
export const ACCOUNT_ROLE_TYPE_TABLE = 'account_role_types';
export const ACCOUNT_ROLES_TABLE = 'account_roles';
export const PROFILE_TYPE_TABLE = 'profile_types';
export const ACCOUNT_TABLE = 'accounts';
export const SESSION_TABLE = 'sessions';
export const PROFILE_TABLE = 'profiles';

// DB UTILITIES CONFIGS
export const CURSOR_BATCH_SIZE = 500;
