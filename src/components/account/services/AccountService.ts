import _ from 'lodash';

import { ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX } from '../../../configs/KafkaConfig';
import { AccountStatusEnum } from '../../../enums/AccountStatusEnum';
import ValidationException from '../../../exceptions/ValidationException';
import { generateHash } from '../../../utils/Encryption';
import { notify } from '../../../utils/Notifier';
import { Account } from '../interfaces/AccountInterface';
import { AccountRepository } from '../repositories/AccountRepository';

export class AccountService {
  private AccountRepository: AccountRepository;

  constructor() {
    this.AccountRepository = new AccountRepository();
  }

  public async create(account: Account): Promise<Account> {
    await this.validateAccount(account);

    const accountData = await this.mapAccountData(account);
    const newAccount = await this.AccountRepository.create(accountData);

    if (newAccount) notify(ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX, newAccount);

    return;
  }

  private async mapAccountData(account: Account): Promise<Account> {
    const accountData = { ..._.omit(account, 'password_confirmation'), status: AccountStatusEnum.EMAIL_VERIFICATION_PENDING };

    if (!account.external_type) {
      const { generatedHash, generatedSalt } = await generateHash(account.password);

      return { ...accountData, password: generatedHash, salt: generatedSalt };
    }

    return accountData;
  }

  private async validateAccount({ email, external_type, external_id, password, password_confirmation }: Account): Promise<void> {
    if (external_type && !external_id) throw new ValidationException({ status: 400 });

    if (password !== password_confirmation) throw new ValidationException({ status: 400 });

    const account = await this.AccountRepository.findByEmail(email);
    if (account) throw new ValidationException({ status: 400 });
  }
}
