import { Router } from 'express';
import { Routes } from '@interfaces/RouteInterface';
import { validateIncomingData } from '@middlewares/SchemaValidator';

import * as AccountValidator from '../validators/AccountValidator';
import AuthController from '../controllers/AuthController';

export class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', validateIncomingData(AccountValidator.create), this.authController.signUp);
  }
}
