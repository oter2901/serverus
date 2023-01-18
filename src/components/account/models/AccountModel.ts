import { ACCOUNT_TABLE } from '@configs/DBConfig';
import { Model, ModelObject } from 'objection';
import { Account } from '../interfaces/AccountInterface';

export class Accounts extends Model implements Account {
  id!: number;
  email!: string;
  password!: string;

  static tableName = ACCOUNT_TABLE; // database table name
  static idColumn = 'id'; // id column name
}

export type AccountShape = ModelObject<Accounts>;
