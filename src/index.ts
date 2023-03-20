import { AccountRoute } from 'components/account/routes';
import LoggerFactory from 'utils/Logger';
import validateEnv from 'utils/validateEnv';

const { logger } = new LoggerFactory('Main');

import App from '@/app';

validateEnv();

const app = new App([new AccountRoute()]);
app.listen();

process.on('unhandledRejection', reason => {
  logger.error('unhandledRejection', reason);
  throw reason;
});

process.on('uncaughtException', error => {
  logger.error(`Uncaught Error ${error.toString()}`);
  logger.debug(error.stack);
});
