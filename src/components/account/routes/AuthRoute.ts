import { Routes } from '@interfaces/RouteInterface';
import { validateIncomingData } from '@middlewares/SchemaValidator';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import AuthController from '../controllers/AuthController';
import * as AccountValidator from '../validators/AccountValidator';

export class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', validateIncomingData(AccountValidator.create), asyncHandler(this.authController.signUp));
  }
}
