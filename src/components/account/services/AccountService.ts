import { CreateAccountDTO } from '../dto/CreateAccountDTO';
import { AccountRepository } from '../repositories/AccountRepository';
import { hash } from 'bcrypt';

export class AccountService {
  private AccountRepository: AccountRepository;
  constructor() {
    this.AccountRepository = new AccountRepository();
  }

  public async findAccountByEmail(email: string) {
    return await this.AccountRepository.findByEmail(email);
  }

  public async createAccount(account: CreateAccountDTO) {
    const hashedPassword = await hash(account.password, 10);
    return await this.AccountRepository.create({ ...account, password: hashedPassword });
  }
}
