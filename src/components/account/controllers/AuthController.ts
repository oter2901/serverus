import { NextFunction, Request, Response } from 'express';
import { Account } from '../interfaces/AccountInterface';
import AuthService from '../services/AuthService';
import { CreateAccountDTO } from '../dto/CreateAccountDTO';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountData: CreateAccountDTO = req.body;
      const signUpAccountData: Account = await this.authService.signup(accountData);

      res.status(201).json({ data: signUpAccountData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
