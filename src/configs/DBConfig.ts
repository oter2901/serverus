const environment = process.env;

export const CONNECTION = environment.PG_CONNECTION || 'postgres://nameless:secret@localhost:5432/serverus';
export const TIMEOUT = parseInt(environment.DB_TIMEOUT || '200', 10);
export const CONNECTION_KEEP_ALIVE_TIMEOUT = parseInt(environment.CONNECTION_KEEP_ALIVE_TIMEOUT || '60000', 10);
export const CONNECTION_POOL_SIZE = parseInt(environment.DB_CONNECTION_POOL_SIZE || '20', 10);
export const DEBUG = environment.DB_DEBUG === 'true' || true;
export const MIGRATIONS_TABLE = 'knex_migrations';

export const ACCOUNT_TABLE = 'account';

export const CURSOR_BATCH_SIZE = 500;
