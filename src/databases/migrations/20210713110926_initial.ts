import { ACCOUNT_TABLE } from '../../configs/DBConfig';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable(ACCOUNT_TABLE, table => {
    table.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email', 45).notNullable();
    table.string('password', 255).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ACCOUNT_TABLE);
}
