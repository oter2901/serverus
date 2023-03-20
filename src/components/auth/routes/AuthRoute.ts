import { Router } from 'express';
// import asyncHandler from 'express-async-handler';

import { Routes } from '../../../interfaces/RouteInterface';
// import { validateIncomingData } from '../../../middlewares/SchemaValidator';
// import * as AccountValidator from '../../account/validators/AccountValidator';
import AuthController from '../controllers/AuthController';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post('/sign-in', validateIncomingData(AccountValidator.create), asyncHandler(this.authController.signIn));
  }
}
