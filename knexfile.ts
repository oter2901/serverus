import { MIGRATIONS_TABLE } from './src/configs/DBConfig';
import { dbConnection } from './src/databases/index';

const db = {
  ...dbConnection,
  migrations: {
    tableName: MIGRATIONS_TABLE,
    directory: './src/databases/migrations',
  },
  seeds: {
    directory: './src/databases/seeds',
  },
};

export default db;
