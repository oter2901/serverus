import { HttpException } from '@exceptions/HttpException';

import { CreateAccountDTO } from '../dto/CreateAccountDTO';
import { Account } from '../interfaces/AccountInterface';

import { AccountService } from './AccountService';

class AuthService {
  private AccountService: AccountService;

  constructor() {
    this.AccountService = new AccountService();
  }

  public async signup({ email, password }: CreateAccountDTO): Promise<Account> {
    const account: Account = await this.AccountService.findAccountByEmail(email);
    if (account) throw new HttpException(409, `This email ${email} already exists`);
    const createAccountData: Account = await this.AccountService.createAccount({ email, password });

    return createAccountData;
  }
}

export default AuthService;
