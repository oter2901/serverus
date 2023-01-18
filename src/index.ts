import App from '@/app';
import { AuthRoute } from '@components/account/routes';

import validateEnv from '@utils/validateEnv';
import { logger } from '@utils/Logger';

validateEnv();

process.on('unhandledRejection', reason => {
  throw reason;
});

process.on('uncaughtException', error => {
  logger.error(`Uncaught Error ${error.toString()}`);
  logger.debug(error.stack);
});

const app = new App([new AuthRoute()]);

app.listen();
