import compression from 'compression';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from 'configs/AppConfig';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import knex from 'databases/index';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { Routes } from 'interfaces/RouteInterface';
import { handleError, logError } from 'middlewares/ErrorHandlerMiddleware';
import morgan from 'morgan';
import { Model } from 'objection';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import LoggerFactory from 'utils/Logger';

const { logger } = new LoggerFactory('Main');

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initializeSwagger();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    Model.knex(knex);
  }

  private initializeMiddlewares() {
    this.app.use(
      morgan(LOG_FORMAT, {
        stream: { write: message => logger.info(message.substring(0, message.lastIndexOf('\n'))) },
      }),
    );
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/v1', route.router);
    });
    this.app.use('/health', (_req, res) => res.status(200).send('Ok'));
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      swaggerUrl: '../swagger/swagger.yaml',
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(logError);
    // this.app.use(handleError);
  }
}

export default App;
