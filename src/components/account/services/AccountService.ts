import { ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX } from '../../../configs/KafkaConfig';
import { generateHash } from '../../../utils/Encryption';
import { notify } from '../../../utils/Notifier';
import { Account } from '../interfaces/AccountInterface';
import { AccountRepository } from '../repositories/AccountRepository';

export class AccountService {
  private AccountRepository: AccountRepository;
  constructor() {
    this.AccountRepository = new AccountRepository();
  }

  public async findAccountByEmail(email: string) {
    return await this.AccountRepository.findByEmail(email);
  }

  public async createAccount(accountData: Account) {
    const { generatedHash, generatedSalt } = await generateHash(accountData.password);
    const account = await this.AccountRepository.create({
      ...accountData,
      password: generatedHash,
      salt: generatedSalt,
    });

    if (account) notify(ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX, account);

    return account;
  }
}
