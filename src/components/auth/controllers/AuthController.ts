import { NextFunction, Request, Response } from 'express';

import { Account } from '../../account/interfaces/AccountInterface';
// import AuthService from '../../account/services/AuthService';

class AuthController {
  // public authService = new AuthService();

  public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountData: Account = req.body;
      // const signUpAccountData: Account = await this.authService.signup(accountData);

      // res.status(201).json({ data: signUpAccountData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
