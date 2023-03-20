import { Request, Response } from 'express';

import { Account } from '../interfaces/AccountInterface';
import { AccountService } from '../services/AccountService';

import { createResponse } from '@/utils/ResponseHandler';

class AccountController {
  public accountService = new AccountService();

  public create = async (req: Request, res: Response): Promise<void> => {
    const accountData: Account = req.body;
    const { status } = await createResponse(this.accountService.create(accountData));

    res.status(status).json();
  };
}

export default AccountController;
