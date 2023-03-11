import { HttpException } from '../../../exceptions/HttpException';
import { CreateAccountDTO } from '../dto/CreateAccountDTO';
import { Account } from '../interfaces/AccountInterface';

import { AccountService } from './AccountService';

class AuthService {
  private AccountService: AccountService;

  constructor() {
    this.AccountService = new AccountService();
  }

  public async signup(accountData: Account): Promise<Account> {
    //TODO: i need to validate if the account already exists, if exists the server should throw an
    // validation error, if email doesn't exist account must be created on a 'VERIFICATION_PENDING' status
    const { email, password } = accountData;
    const account: Account = await this.AccountService.findAccountByEmail(email);
    if (account) throw new HttpException(401, `This email ${email} already exists`);
    const createAccountData: Account = await this.AccountService.createAccount({ email, password });
    return createAccountData;
  }

  private validateAccount() {
    //TODO: here we should vailidate if the data provided by the client is correct, i.e: if the password is sent
    // we should validate if the password and the repeated password are the same, the complexity of the password and so on
  }
}

export default AuthService;
