import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../constants/index.js';
import { errorHandlerMiddleware } from '../middlewares/errorHandlerMiddleware.js';
import { notFoundMiddleware } from '../middlewares/notFoundMiddleware.js';
import router from '../routers/contacts.js';


export const startServer = () => {
  const app = express();

  app.use(express.json({
    limit: '10kb',
    type: ['application/json','application/vnd.api+json'],
  }));
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(router);


  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  const PORT = env(ENV_VARS.PORT, 3000);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
};
