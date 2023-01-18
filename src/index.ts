import { AuthRoute } from '@components/account/routes';
import { logger } from '@utils/Logger';

import App from '@/app';
import validateEnv from '@/utils/validateEnv';

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
