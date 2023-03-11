import { NextFunction, Request, Response } from 'express';

import { CreateAccountDTO } from '../dto/CreateAccountDTO';
import { Account } from '../interfaces/AccountInterface';
import AuthService from '../services/AuthService';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountData: Account = req.body;
      const signUpAccountData: Account = await this.authService.signup(accountData);

      res.status(201).json({ data: signUpAccountData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
