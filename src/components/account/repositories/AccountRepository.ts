import { CreateAccountDTO } from '../dto/CreateAccountDTO';
import { Accounts } from '../models/AccountModel';

import { ACCOUNT_TABLE } from '@/configs/DBConfig';

export class AccountRepository {
  private TABLE: string;
  constructor() {
    this.TABLE = ACCOUNT_TABLE;
  }

  public async findByEmail(email: string) {
    return await Accounts.query().select().from(this.TABLE).where('email', '=', email).first();
  }

  public async create(account: CreateAccountDTO) {
    return await Accounts.query().insert(account).into(this.TABLE);
  }
}
