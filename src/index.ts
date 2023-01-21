import { AuthRoute } from '@components/account/routes';
import LoggerFactory from '@utils/Logger';
import validateEnv from '@utils/validateEnv';

const logger = new LoggerFactory(__filename);

import App from '@/app';

validateEnv();

const app = new App([new AuthRoute()]);
app.listen();

process.on('unhandledRejection', reason => {
  logger.crit('unhandledRejection', reason);
  throw reason;
});

process.on('uncaughtException', error => {
  logger.error(`Uncaught Error ${error.toString()}`);
  logger.debug(error.stack);
});
