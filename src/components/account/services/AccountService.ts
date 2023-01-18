import { ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX } from '@configs/KafkaConfig';
import { notify } from '@utils/Notifier';
import { hash } from 'bcrypt';

import { CreateAccountDTO } from '../dto/CreateAccountDTO';
import { AccountRepository } from '../repositories/AccountRepository';

export class AccountService {
  private AccountRepository: AccountRepository;
  constructor() {
    this.AccountRepository = new AccountRepository();
  }

  public async findAccountByEmail(email: string) {
    return await this.AccountRepository.findByEmail(email);
  }

  public async createAccount(accountData: CreateAccountDTO) {
    const hashedPassword = await hash(accountData.password, 10);
    const account = await this.AccountRepository.create({ ...accountData, password: hashedPassword });
    notify(ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX, account);

    return account;
  }
}
