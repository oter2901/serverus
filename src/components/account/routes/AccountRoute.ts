import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { Routes } from '../../../interfaces/RouteInterface';
import { validateIncomingData } from '../../../middlewares/SchemaValidator';
import AccountController from '../controllers/AccountController';
import * as AccountValidator from '../validators/AccountValidator';

export class AccountRoute implements Routes {
  public path = '/account';
  public router = Router();
  public accountController = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validateIncomingData(AccountValidator.create), asyncHandler(this.accountController.create));
  }
}
